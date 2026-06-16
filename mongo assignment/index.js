require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')



const app = express();

const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');

app.use(bodyParser.json())

app.use('/admin', adminRouter)
app.use('/user', userRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
});