import {db} from '../database.js'

export const addGames = async (req, res) =>{
    const {name, image, stockTotal, pricePerDay} = req.body;
    try{
        const gamerRegistered = await db.query(`SELECT * FROM games WHERE name=$1`, [name])

        if (gamerRegistered.rows[0]) return res.sendStatus(409)

        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, [name, image, stockTotal, pricePerDay]);
        
        res.sendStatus(201)
    }
    catch{
        res.sendStatus(400)
    }
}

export const getGames = async (req, res) =>{
    try{
        const games = (await db.query(`SELECT * FROM games;`)).rows;
        res.status(200).send(games)
    }
    catch{
        res.sendStatus(400)
    }
}
