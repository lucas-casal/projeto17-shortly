import dayjs from "dayjs";
import { db } from "../database.js";
import bcrypt from 'bcrypt'
import { v4 as uuid } from "uuid";

export const addUser = async (req, res) => {
    const {email, name, password, confirmPassword} = req.body;
    if (password !== confirmPassword) return res.sendStatus(422)
    const hash = bcrypt.hashSync(password, 10);

    try{

        const userRegistered = await db.query(`SELECT * FROM users WHERE email=$1;`, [email])
        if (userRegistered.rows[0]) return res.status(409).send(`email ${email} já está em uso`)
 
        await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`, [name, email, hash])
        res.sendStatus(201)
    }
    catch{
        res.sendStatus(400)
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    const token = uuid();
    console.log(token)
    try{

        const userRegistered = await (await db.query(`SELECT * FROM users WHERE email=$1;`, [email])).rows[0]
        console.log(userRegistered)
        if (!userRegistered) return res.sendStatus(404);
        if (!bcrypt.compareSync(password, userRegistered.password)) return res.sendStatus(401);

        await db.query(`INSERT INTO tokens (user_id, token) VALUES ($1, $2);`, [userRegistered.id, token])
        res.status(200).send(token)
    }
    catch{
        res.sendStatus(400)
    }
}

export const getUser = async (req, res) => {
    const {authorization} = req.headers;
    const token = authorization.slice(7)
    console.log(token)
    try{
        const userRegistered = (await db.query(`
        SELECT users.id, users.name, SUM(links.views) as "viewsCount",
        json_agg(json_build_object('id', links.iD, 'shortedUrl', links.short, 'url', links.original, 'viewsCount', links.views) order by links.id) as "shortenedUrls"
        FROM tokens 
        inner JOIN users ON users.id = tokens.user_id
        left JOIN links ON links.user_id = tokens.user_id
        WHERE token=$1
        GROUP BY users.id;
        `, [token])).rows[0]
        
        if(!userRegistered) return res.sendStatus(404)

        if (userRegistered.viewsCount === null) {
            userRegistered.viewsCount = 0
            userRegistered.shortenedUrls = []
        }
       
        
        res.send(userRegistered)
    }
    catch{
        res.sendStatus(400)
    }
}
