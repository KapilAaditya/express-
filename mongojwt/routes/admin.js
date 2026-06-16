require('dotenv').config()
const jwt = require('jsonwebtoken')
const pass = process.env.JWT_SECRET
const { Router } = require("express")
const router = Router()
const { Admin } = require("../database")
const adminMiddleware = require("../middleware/admin")


router.post('/signup', async (req, res) => {
    //   console.log('here')
    await Admin.create({
        username: req.body.username,
        password: req.body.password,
    })
    res.json({
        message: 'User created successfully',
    })
})
router.post('/signin',  async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await Admin.findOne({
        username,
        password
    })
    if (user) {

        const token = jwt.sign({
            username
        }, pass);
        res.json({
            token
        })

    }else{
        res.status(403).json({
            msg:"Wrong username or password [Please check Your credentials ]"
        })
    }
})

module.exports=router