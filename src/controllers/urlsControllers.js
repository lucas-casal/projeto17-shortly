import {db} from '../database.js'
import { nanoid } from 'nanoid';

export const addURL = async (req, res) =>{
    const {url} = req.body;
    const {authorization} = req.headers;
    
    const shortUrl = nanoid()
    const token = authorization.slice(7)

    const queryInfo = [token, url, shortUrl]
    try{
        const {user_id} = (await db.query(`SELECT * FROM tokens WHERE token=$1`, [token])).rows[0]
        if (!user_id) return res.sendStatus(401)

        const urlRegistered = (await db.query(`SELECT * FROM links WHERE url=$1`, [url])).rows[0]
        if (urlRegistered) return res.sendStatus(409)


        await db.query(`INSERT INTO links (user_id, url, short) VALUES ($1, $2, $3);`, [user_id, url, shortUrl]);
        
        const done = (await db.query(`SELECT * FROM links WHERE url=$1`, [url])).rows[0]
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
        res.redirect(302, shorted.url)
    }
    catch{
        res.sendStatus(400)
    }
}

export const ranking = async (req, res) => {
    const topUsers = (await db.query(`
    SELECT users.id, users.name, COALESCE(SUM(links.views), 0) as "viewsCount",
        COUNT(links.url) as "linksCount"
  		FROM links
      	right JOIN users ON users.id = links.user_id
        GROUP BY users.id 
		ORDER BY "viewsCount" DESC
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

export const deleteURL = async (req, res) => {
    const {authorization} = req.headers
    const {id} = req.params
    const token = authorization.slice(7) 

    try{
        const urlRegistered = (await db.query(`
        SELECT * FROM links WHERE id=$1;`, [id])).rows[0]
       
        if (!urlRegistered) return res.sendStatus(404)

        const matching = (await db.query(`
        SELECT * 
        FROM tokens 
        WHERE token=$1`, [token])).rows[0]
        if (!matching) return res.sendStatus(401)

        if (matching.user_id !== urlRegistered.user_id) return res.sendStatus(401)
        
        await db.query(`
        DELETE FROM links 
        WHERE id=$1
        `, [id])

        res.sendStatus(204)
    }
    catch{
        res.sendStatus(400)
    }
}

export const nickURL = async (req, res) => {
    const {authorization} = req.headers;
    const {newNick} = req.body;
    const {id} = req.params;
    const token = authorization.slice(7) 

    try{
        const urlRegistered = (await db.query(`
        SELECT * FROM links WHERE id=$1;`, [id])).rows[0]
       
        if (!urlRegistered) return res.sendStatus(404)

        const matching = (await db.query(`
        SELECT * 
        FROM tokens 
        WHERE token=$1`, [token])).rows[0]
        if (!matching) return res.sendStatus(401)

        if (matching.token !== token) return res.sendStatus(401)
        
        await db.query(`
        UPDATE links SET nickname=$1 WHERE id=$2`, [newNick, id])
        res.sendStatus(200)
    }
    catch{
        res.sendStatus(400)
    }
}