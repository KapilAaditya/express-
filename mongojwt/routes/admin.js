require('dotenv').config()
const jwt = require('jsonwebtoken')
const pass = process.env.JWT_SECRET
const { Router } = require("express")
const router = Router()
const { Admin ,Course} = require("../database")
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
router.post('/courses', adminMiddleware,async (req, res) => {
  //const { title, description, price, imageLink } = req.body
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageLink = req.body.imageLink;
  const existingCourse = await Course.findOne({title:title})
  if(existingCourse){
    res.status(400).json({msg:"A Course with the same title all ready exist"})
  }
  const newCourse =await Course.create({
    title:title,
    description:description,
    price:price,
    imageLink:imageLink,
  })
  console.log(newCourse);
  
  res.json({
    message: 'Course created successfully',courseId: newCourse._id
  })
})
router.get('/courses', adminMiddleware, (req, res) => {
  Course.find().then((courses) => {
    res.json(courses)
  })
})
module.exports=router




//    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFhZGl0eWFrYXBpbDIwMDZAZ21haWwuY29tIiwiaWF0IjoxNzgxNjc2NzczfQ.TaLxvBany58L6ykOoClXNqTTqdf0rX1QP9zJ-tS86P4"
