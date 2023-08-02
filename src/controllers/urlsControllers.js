import {db} from '../database.js'
import { nanoid } from 'nanoid';

export const addURL = async (req, res) =>{
    const {url} = req.body;
    const {authorization} = req.headers;
    
    const shortUrl = nanoid()
    const token = authorization.slice(7)

    const queryInfo = [token, url, shortUrl]
    try{
        const urlRegistered = await db.query(`SELECT * FROM links WHERE original=$1`, [url])

        if (urlRegistered.rows[0]) return res.sendStatus(409)
        const {user_id} = (await db.query(`SELECT * FROM tokens WHERE token=$1`, [token])).rows[0]


        await db.query(`INSERT INTO links (user_id, original, short) VALUES ($1, $2, $3);`, [user_id, url, shortUrl]);
        
        const done = (await db.query(`SELECT * FROM links WHERE original=$1`, [url])).rows[0]
        res.status(201).send({id: done.id, shortUrl})
    }
    catch{
        res.sendStatus(422)
    }
}

export const getURL = async (req, res) =>{
    const {name, limit, offset, desc} = req.query;
    let {order} = req.query;

    const queryInfo = []
    name ? queryInfo.push(name+'%') : ''
    limit ? queryInfo.push(limit): ''
    offset ? queryInfo.push(offset): ''


    const indexArray = ['']
    name ? indexArray.push('name') : ''
    limit ? indexArray.push('limit'): ''
    offset ? indexArray.push('offset'): ''


    if(order?.includes(';')){
        order = order.slice(0, order.indexOf(';'))
    }


    try{
        const games = (await db.query(`
        SELECT * 
        FROM games 
        ${name ? `WHERE lower(name) LIKE lower($${indexArray.indexOf('name')})` : ``}
        ${order ? `ORDER BY "${order}" ${desc ? `DESC`: ``}` : ``}
        ${limit ? `LIMIT $${indexArray.indexOf('limit')}` : ``}
        ${offset ? `OFFSET $${indexArray.indexOf('offset')}` : ``}
        ;`, queryInfo)).rows
        
        res.status(200).send(games)
    }
    catch{
        res.sendStatus(400)
    }
}
