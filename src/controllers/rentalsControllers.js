import { db } from "../database.js";
import dayjs from "dayjs";

export const addRental = async (req, res) => {
    const {customerId, gameId, daysRented} = req.body;
    const rentDate = dayjs().format('DD/MM/YYYY')

    try{
        const game = (await db.query(`
            SELECT * FROM games WHERE id=$1;
        `, [gameId])).rows[0]
       
        const user = (await db.query(`
            SELECT * FROM customers WHERE id=$1;
        `, [customerId])).rows[0]

        if(!user || !game) return res.sendStatus(400)
        
        const gamesNotReturned = (await db.query(`
            SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL;
        `, [gameId])).rows

        const qtyNotReturned = gamesNotReturned.length;

        if (game.stockTotal === qtyNotReturned) return res.sendStatus(400)

        const originalPrice = parseInt(daysRented) * parseInt(game.pricePerDay)
        
        await db.query(`
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
        VALUES ($1, $2, $3, $4, null, $5, null);
        `, [customerId, gameId, rentDate, daysRented, originalPrice])

        res.sendStatus(201)
    } 
    catch{
        res.sendStatus(400)
    }
}