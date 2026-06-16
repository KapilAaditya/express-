const { Router } = require('express')
const adminMiddleware = require('../middleware/admin')
const router = Router()
const { Admin, Course } = require('../databases/index')

// Admin Routes
router.post('/signup', (req, res) => {
//   console.log('here')
  Admin.create({
    username: req.body.username,
    password: req.body.password,
  })
  res.json({
    message: 'User created successfully',
  })
})

router.post('/courses', adminMiddleware,async (req, res) => {
  //const { title, description, price, imageLink } = req.body
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageLink = req.body.imageLink;
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

module.exports = router