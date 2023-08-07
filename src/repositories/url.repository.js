import { db } from "../database.js";

export async function searchLinkByURL(x) {
    return db.query(`SELECT * FROM links WHERE url=$1`, [x])
}

export async function insertNewLink(userId, url, shortUrl) {
    return db.query(`INSERT INTO links (user_id, url, "shortUrl") VALUES ($1, $2, $3);`, [userId, url, shortUrl]);
}

export async function searchLinkbyURL (x) { 
    return db.query(`SELECT * FROM links WHERE url=$1`, [x])
}

export async function searchLinkById (x) { 
    return (db.query(`
    SELECT * 
    FROM links
    WHERE id=$1
    ;`, [x]))
}

export async function searchLinkByShort (x) {
    return db.query(`SELECT * FROM links WHERE "shortUrl"=$1`, [x])
}

export async function getRanking() {
    return (db.query(`
    SELECT users.id, users.name, COALESCE(SUM(links.views), 0) as "visitCount",
        COUNT(links.url) as "linksCount"
  		FROM links
      	right JOIN users ON users.id = links.user_id
        GROUP BY users.id 
		ORDER BY "visitCount" DESC
		LIMIT 10
		;
	`))
}

export async function deleteLinkById(x) {
    return (db.query(`
    DELETE FROM links 
    WHERE id=$1
    `, [x]))
}

export async function updateNickById(id, nick) {
    return (db.query(`
    UPDATE links SET nickname=$1 WHERE id=$2`, [nick, id]))
}