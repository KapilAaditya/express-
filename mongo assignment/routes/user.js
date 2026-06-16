const express = require('express');
const UserMiddleware = require('../middleware/user');
const { User, Course } = require('../databases');
const router = express.Router();

router.post('/signup', UserMiddleware, (req, res) => {
    const username = req.body.username
    const password = req.body.password
    User.create({
        username, password
    })
    res.json({ msg: "User Created successfully" })
})
router.get('/courses', async (req, res) => {
    // try {
    const response = await Course.find({});

    res.json({
        courses: response
    });
    // } catch (err) {
    //     res.status(400).json({
    //         msg: "Error featching the courses ",
    //         error: err.message
    //     })
    // }
})

router.post('/courses/:CourseId', UserMiddleware, async (req, res) => {
    const CourseId = req.params.CourseId
    const username = req.headers.username

    await User.updateOne({
        username: username
    },
        {
            "$push": {
                purchasedCourses: CourseId
            }
        })
    res.json({ msg: "Purchase completed" })
})


router.get('/pechaesd', UserMiddleware, async (req, res) => {
    const user = await User.findOne({
        username: req.headers.username

    })
    console.log(user.purchasedCourses)
    const courses = await Course.find({
        _id
            : {
            "$in"
                : user.purchasedCourses
        }
    })
    res.json({
        courses: courses
    })

})

module.exports = router;