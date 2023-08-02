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
        res.sendStatus(422)
    }
}

export const login = async (req, res) => {
    const {username, password} = req.body;
    const token = uuid();
    console.log(token)
    try{

        const userRegistered = await (await db.query(`SELECT * FROM users WHERE username=$1;`, [username])).rows[0]
        console.log(userRegistered)
        if (!userRegistered) return res.sendStatus(404);
        if (!bcrypt.compareSync(password, userRegistered.password)) return res.sendStatus(401);

        await db.query(`INSERT INTO sessions (user_id, token) VALUES ($1, $2);`, [userRegistered.id, token])
        res.status(201).send(token)
    }
    catch{
        res.sendStatus(400)
    }
}
export const getUsers = async (req, res) => {

    const {cpf, offset, limit, desc} = req.query
    let {order} = req.query
    const queryInfo = []
    cpf ? queryInfo.push(cpf+'%'): ''
    limit ? queryInfo.push(limit): ''
    offset ? queryInfo.push(offset): ''


    const indexArray = ['']
    cpf ? indexArray.push('cpf') : ''
    limit ? indexArray.push('limit'): ''
    offset ? indexArray.push('offset'): ''


    if(order?.includes(';')){
        order = order.slice(0, order.indexOf(';'))
    }


    try{
        const usersList = (await db.query(`
        SELECT * 
        FROM users 
        ${cpf ? `WHERE cpf LIKE $${indexArray.indexOf('cpf')} ` : ``}
        ${order ? `ORDER BY ${order} ${desc ? "DESC" : ''}` : ``}
        ${limit ? `LIMIT $${indexArray.indexOf('limit')} ` : ``}
        ${offset ? `OFFSET $${indexArray.indexOf('offset')}` : ``}
        ;`, queryInfo)).rows

        res.send(usersList)
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
export const putUser = async (req, res) => {
    const {id} = req.params;
    const {name, phone, cpf, birthday} = req.body;
    const niver = dayjs(birthday).format("YYYY-MM-DD")
    try{
        const userRegistered = (await db.query(`SELECT * FROM users WHERE id=$1`, [id])).rows[0]
        const userWithCPF = (await db.query(`SELECT * FROM users WHERE cpf=$1`, [cpf])).rows[0]
        console.log(userRegistered)
        console.log(userWithCPF)
        if (userWithCPF? userWithCPF.id !== userRegistered.id : false) return res.sendStatus(409)

        await db.query(
            `
            UPDATE users 
            SET name=$1, phone=$2, cpf=$3, birthday=$4
            WHERE id=$5;
            `, [name, phone, cpf, niver, id]
        )
        res.sendStatus(200)
    }
    catch{
        res.sendStatus(400)
    }

}