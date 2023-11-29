const jwt = require('jsonwebtoken')
const access_secret = process.env.ACCESS_TOKEN_SECRET



exports.getAccessToken = (username) => {
    return new Promise((resolve,reject)=>{
        jwt.sign({username},access_secret,{expiresIn:3600},(err,token)=>{
            if(err) reject(err)
            resolve(token)
        })
    })
}


exports.verifyAccessToken = (accessToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(accessToken, access_secret, (err, decode) => {
            if (err) {
                console.error('Error during access token verification:', err);
                reject(err);
            }
            console.log('Access token verified successfully:', decode);
            resolve(decode.username);
        });
    });
}


