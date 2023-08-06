import { db } from "../database.js";
import bcrypt from 'bcrypt'


export async function searchUserByToken(x) {
    return await db.query(`SELECT * FROM tokens WHERE token=$1`, [x])
}

export async function searchUserByEmail(x) {
    return await db.query(`SELECT * FROM users WHERE email=$1`, [x])
}

export async function insertNewUser(name, email, password) {
    const hash = bcrypt.hashSync(password, 10);
    return await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`, [name, email, hash])
}

export async function insertNewToken(userId) {

    console.log(userId)
    console.log(token)
    return await db.query(`INSERT INTO tokens (user_id, token) VALUES ($1, $2);`, [userId, token])
}

export async function getUserByToken(token){
    return (await db.query(`
        SELECT users.id, users.name, SUM(links.views) as "visitCount",
        json_agg(json_build_object('id', links.iD, 'shortedUrl', links.short, 'url', links.url, 'visitCount', links.views, 'nickname', links.nickname) order by links.id) as "shortenedUrls"
        FROM tokens 
        inner JOIN users ON users.id = tokens.user_id
        left JOIN links ON links.user_id = tokens.user_id
        WHERE token=$1
        GROUP BY users.id;
        `, [token]))
}