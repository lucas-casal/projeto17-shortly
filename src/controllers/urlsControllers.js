import {db} from '../database.js'
import { nanoid } from 'nanoid';
import { searchUserByToken } from '../repositories/user.repository.js';
import { deleteLinkById, getRanking, insertNewLink, searchLinkById, searchLinkByShort, searchLinkByURL, searchLinkbyURL, updateNickById } from '../repositories/url.repository.js';

export const addURL = async (req, res) =>{
    const {url} = req.body;
    const {authorization} = req.headers;
    
    const shortUrl = nanoid()
    const token = authorization.slice(7)

    try{
        console.log(token)

        const userRegistered = (await searchUserByToken(token)).rows[0]
        if (!userRegistered) return res.sendStatus(401)

        const urlRegistered = (await searchLinkByURL(url)).rows[0]
        if (urlRegistered) return res.sendStatus(409)

        await insertNewLink(userRegistered.user_id, url, shortUrl)
        
        const done = (await searchLinkbyURL(url)).rows[0]
        res.status(201).send({id: done.id, shortUrl})
    }
    catch{
        res.sendStatus(400)
    }
}

export const getURL = async (req, res) =>{
    const {id} = req.params;


    try{
        const shorted = (await searchLinkById(id)).rows[0]
        
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
        const shorted = (await searchLinkByShort(shortUrl)).rows[0]
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
    const topUsers = (await getRanking()).rows

    topUsers.map(x => {
        if (x.visitCount === null){
            x.visitCount = '0'
        }
    })

    res.send(topUsers)
}

export const deleteURL = async (req, res) => {
    const {authorization} = req.headers
    const {id} = req.params
    const token = authorization.slice(7) 

    try{
        const urlRegistered = (await searchLinkById(id)).rows[0]
       
        if (!urlRegistered) return res.sendStatus(404)

        const matching = (await searchUserByToken(token)).rows[0]

        if (!matching) return res.sendStatus(401)

        if (matching.user_id !== urlRegistered.user_id) return res.sendStatus(401)
        
        await deleteLinkById(id)

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
        const urlRegistered = (await searchLinkById(id)).rows[0]

        if (!urlRegistered) return res.sendStatus(404)

        const matching = (await searchUserByToken(token)).rows[0]
        if (!matching) return res.sendStatus(401)

        if (matching.token !== token) return res.sendStatus(401)
        
        await updateNickById(id, newNick)
        res.sendStatus(200)
    }
    catch{
        res.sendStatus(400)
    }
}