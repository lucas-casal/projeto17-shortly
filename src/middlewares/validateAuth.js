export async function validateAuth (req, res, next){
    const {authorization} = req.headers
    if (!authorization) return res.sendStatus(401)
    try{
        next()
    } catch(err){
        res.send(err.message).status(404)
    }

}