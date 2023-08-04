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
    const {id} = req.params;


    try{
        const shorted = (await db.query(`
        SELECT * 
        FROM links
        WHERE id=$1
        ;`, [id])).rows[0]
        
        if (!shorted) return res.sendStatus(404)
        
        delete shorted.user_id
        delete shorted.views

        res.status(200).send(shorted)
    }
    catch{
        res.sendStatus(400)
    }
}

export const openURL = async (req, res) => {
    const {shortUrl} = req.params;
    try{
        const shorted = (await db.query(`SELECT * FROM links WHERE short=$1`, [shortUrl])).rows[0]
        if (!shorted) return res.sendStatus(404)

        shorted.views++

        await db.query(`UPDATE links SET views=$1 WHERE id=$2;`, [shorted.views, shorted.id])
        res.redirect(200,shorted.original)
    }
    catch{
        res.sendStatus(400)
    }
}

export const ranking = async (req, res) => {
    const topUsers = (await db.query(`
        SELECT users.id, users.name, SUM(links.views) as "viewsCount",
        COUNT(links.original) as "linksCount"
  		FROM links
      	RIGHT JOIN users ON users.id = links.user_id
        GROUP BY users.id 
		ORDER BY "viewsCount"
		LIMIT 10
		;
	`)).rows

    topUsers.map(x => {
        if (x.viewsCount === null){
            x.viewsCount = '0'
        }
    })

    res.send(topUsers)
}