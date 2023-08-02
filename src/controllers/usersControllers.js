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
    const {id} = req.params;
    if (isNaN(id) || !Number.isInteger(parseFloat(id)) || id < 0) return res.sendStatus(400)
    try{
        const userRegistered = await (await db.query(`SELECT * FROM users WHERE id=$1`, [id])).rows[0]
        
        if (!userRegistered) return res.sendStatus(404)

        const formatado = dayjs(userRegistered.birthday).format("YYYY-MM-DD");
        
        userRegistered.birthday = formatado
        res.send(userRegistered)
    }
    catch{
        res.sendStatus(400)
    }
}
