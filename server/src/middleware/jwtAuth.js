const jwt = require('jsonwebtoken')
const config = require('../config/config-jwt')
const { log } = require('console')

function verifyToken(req,res,next) {
    const token = req.headers.token
    

    if(!token) {
        return res.status(403).json({message: 'Token is required for authentication'})
    }

    jwt.verify(token,config.secret, (err, decode) => {
        if(err){
            console.error('Error during token verification:', err);
            return res.status(500).json({error : "Unauthorized Token!"})
        }
        
        req.user = decode
        console.log(req.user.username)
        next()
    })
} 
 
module.exports = verifyToken