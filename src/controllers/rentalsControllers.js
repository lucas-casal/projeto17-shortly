import { db } from "../database.js";
import dayjs from "dayjs";

export const addRental = async (req, res) => {
    const {customerId, gameId, daysRented} = req.body;
    const rentDate = dayjs().format('YYYY-MM-DD')

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

export const getRentals = async (req, res) => {
    const {status, customerId, gameId, limit, offset, desc, startDate} = req.query;
    let {order} = req.query;

    const returned = status==='open' ? 'IS NULL' : (status==='closed' ? 'IS NOT NULL' : '')
    const whereArray = []
    status ? whereArray.push(returned) : ''
    customerId ? whereArray.push('customerId') : ''
    startDate ? whereArray.push('startDate') : ''
    gameId ? whereArray.push('gameId') : ''

    const queryInfo = []
    customerId ? queryInfo.push(customerId) : ''
    startDate ? queryInfo.push(startDate) : ''
    gameId ? queryInfo.push(gameId) : ''
    limit ? queryInfo.push(limit): ''
    offset ? queryInfo.push(offset): ''


    const indexArray = ['']
    customerId ? indexArray.push('customerId') : ''
    startDate ? indexArray.push('startDate') : ''
    gameId ? indexArray.push('gameId') : ''
    limit ? indexArray.push('limit'): ''
    offset ? indexArray.push('offset'): ''


    if(order?.includes(';')){
        order = order.slice(0, order.indexOf(';'))
    }

    function where(){
        return (`${returned ? `WHERE "returnDate" ${whereArray[0]}` : ''} 
        ${customerId ? `${returned ? `AND` : `WHERE`} "customerId"=$${indexArray.indexOf('customerId')}` : ''}
        ${startDate ? `${whereArray.indexOf('startDate')>0 ? `AND` : `WHERE`} "rentDate" >= $${indexArray.indexOf('startDate')}` : ''}
        ${gameId ? `${whereArray.length > 1 ? `AND` : `WHERE`} "gameId"=$${indexArray.indexOf('gameId')}` : ''}
        `)
    }

    console.log(`SELECT rentals.*, games.name AS game, customers.name AS customer 
        FROM rentals 
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id 
        ${where()}
        ${order ? `ORDER BY ${order} ${desc ? `DESC` : ``}` : ``}
        ${limit ? `LIMIT $${indexArray.indexOf('limit')}` : ``}
        ${offset ? `OFFSET $${indexArray.indexOf('offset')}` : ``}
        ;`, queryInfo)
    
    try{
        const rentals = (await db.query(`
            SELECT rentals.*, games.name AS game, customers.name AS customer 
            FROM rentals 
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id 
            ${where()}
            ${order ? `ORDER BY ${order} ${desc ? `DESC` : ``}` : ``}
            ${limit ? `LIMIT $${indexArray.indexOf('limit')}` : ``}
            ${offset ? `OFFSET $${indexArray.indexOf('offset')}` : ``}
            ;`, queryInfo)).rows;



        rentals.map(x => {
            x.customer = {
                name: x.customer,
                id: x.customerId
            }
            x.game = {
                name: x.game,
                id: x.gameId
            }
        })

        res.send(rentals)
    }
    catch{
        res.sendStatus(400)
    }
}

export const returnRental = async (req, res) => {
    const {id} = req.params
    const date = dayjs()
    const returnDate = date.format("YYYY-MM-DD");
    console.log(returnDate)

    try{
        const rental = (await db.query(`SELECT * FROM rentals WHERE id=$1`, [id])).rows[0]
        if (!rental) return res.sendStatus(404)
        if (rental.returnDate) return res.sendStatus(400)
        const rentDate = dayjs(rental.rentDate).add(rental.daysRented, 'day').startOf('day')
        const difDate = Math.floor((date - rentDate)/86400000)
        console.log(difDate)
        const delayFee = difDate > 0 ? (rental.originalPrice/rental.daysRented)*difDate : null;

   
        console.log(delayFee)

        await db.query(`
            UPDATE rentals
            SET "returnDate"=$1, "delayFee"=$2
            WHERE id=$3;
        `, [returnDate, delayFee, id])


        res.sendStatus(200)


    }
    catch{
        res.sendStatus(400)
    }
}

export const deleteRental = async (req, res) => {
    const {id} = req.params;

    try{
        const rental = (await db.query(`SELECT * FROM rentals WHERE id=$1`, [id])).rows[0]
        if (!rental) return res.sendStatus(404)
        if (!rental.returnDate) return res.sendStatus(400)

        await db.query(`DELETE FROM rentals WHERE id=$1;`, [id])
        res.sendStatus(200)
    }   
    catch{
        res.sendStatus(400)
    }
}

