require('dotenv').config()
const pass = process.env.JWT_SECRET
const { Router } = require("express")
const router = Router()
const { Admin, Course, User } = require("../database")
const userMiddleware = require("../middleware/user")
const jwt = require('jsonwebtoken')

router.post('/signup', async (req, res) => {
    const { username, password } = req.body
    try {

        const userexists = await User.findOne({ username: username })

        if (userexists) {
            return res.status(403).json({ msg: "User already exist " })
        }



        await User.create({
            username: username, password: password
        })
        const token = jwt.sign({ username }, pass)
        res.json({ msg: "User Created successfully ", token })


    } catch (e) {
        res.status(400).json({ msg: "Check your inputs " })
        res.status(400).json({
            msg: "Check your inputs",
            error: e.message
        })
    }



})
router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({
            username: username,
            password: password
        });

        // console.log(user);

        if (user) {
            const token = jwt.sign({ username }, pass);

            return res.json({
                msg: "Login successful",
                token: token
            });
        } else {
            return res.status(403).json({
                msg: "Invalid username or password. Please try again or Signup."
            });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});
router.post('/profile', userMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.user.username
        });

        if (!user) {
            return res.status(404).json({
                msg: "User not found. Check your username and token."
            });
        }

        return res.json({
            msg: "Profile Data",
            user: {
                username: user.username
            }
        });

    } catch (e) {
        return res.status(500).json({ msg: "Server error", error: e.message });
    }
});
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
module.exports = router