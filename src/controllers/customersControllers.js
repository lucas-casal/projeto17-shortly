import { db } from "../database.js";

export const addCustomer = async (req, res) => {
    const {name, phone, cpf, birthday} = req.body;

    try{
        const userRegistered = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf])

        if (userRegistered.rows[0]) return res.sendStatus(409)

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday])

        res.sendStatus(201)
    }
    catch{
        res.sendStatus(400)
    }
}
export const getAllCustomers = async (req, res) => {

    try{
        const costumersList = (await db.query(`SELECT * FROM customers`)).rows

        if (!costumersList) return res.status(404).send('No costumers registered')

        res.send(costumersList)
    }
    catch{
        res.sendStatus(400)
    }
}
export const getCustomer = async (req, res) => {
    const {id} = req.params;
    if (isNaN(id) || !Number.isInteger(parseFloat(id)) || id < 0) return res.sendStatus(422)
    try{
        const userRegistered = await (await db.query(`SELECT * FROM customers WHERE id=$1`, [id])).rows[0]

        if (!userRegistered) return res.sendStatus(404)

        res.send(userRegistered)
    }
    catch{
        res.sendStatus(400)
    }
}
export const putCustomer = async (req, res) => {
    const {id} = req.params;
    const {name, phone, cpf, birthday} = req.body;

    try{
        const userRegistered = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf])
        if (userRegistered.rows[0]?.id !== parseInt(id)) return res.sendStatus(409)

        await db.query(
            `
            UPDATE customers 
            SET name=$1, phone=$2, cpf=$3, birthday=$4
            WHERE id=$5;
            `, [name, phone, cpf, birthday, id]
        )
        res.sendStatus(200)
    }
    catch{
        res.sendStatus(400)
    }

}