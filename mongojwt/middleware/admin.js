require('dotenv').config()
const jwt = require('jsonwebtoken')
const pass = process.env.JWT_SECRET
const express = require('express')

function adminMiddleware(req, res, next) {
    const token = req.headers.authorization;
    
    // SAFETY CHECK: If no token header is provided, stop here before splitting
    if (!token) {
        return res.status(401).json({ msg: "Authorization header is missing" })
    }

    const words = token.split(" ")
    const jwtToken = words[1]

    // CRITICAL FIX: Wrap verify in a try/catch block to prevent runtime crashes
    try {
        const verify = jwt.verify(jwtToken, pass)
        console.log(verify);
        
        if (verify.username) {
            next();
        } else {
            res.status(403).json({ msg: "Admin not authenticated" })
        }
    } catch (err) {
        // This catches expired tokens, invalid signatures, or malformed strings safely
        res.status(403).json({ msg: "Invalid or expired token", error: err.message })
    }
}

module.exports = adminMiddleware