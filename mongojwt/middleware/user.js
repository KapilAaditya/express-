require('dotenv').config()
const jwt = require('jsonwebtoken')
const pass = process.env.JWT_SECRET

function adminMiddleware (req,res,next){
    const token = req.headers.authorization;
    const words = token.split(" ")
    const jwtToken = words[1]
    const verify = jwt.verify(jwtToken,pass)
    console.log(verify);
    
    
}

module.exports=adminMiddleware