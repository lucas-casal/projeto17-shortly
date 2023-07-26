import {db} from '../database.js'
export const addGames = async (req, res) =>{
    const {name, image, stockTotal, pricePerDay} = req.body;
    try{
        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ('${name}', '${image}', ${stockTotal}, ${pricePerDay});`);
        res.sendStatus(201)
    }
    catch{
        res.sendStatus(400)
    }
}