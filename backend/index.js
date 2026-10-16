require('dotenv').config({path:'.env'})
const cors = require('cors')
const fileup = require('express-fileupload')
const path = require('path')
const express = require('express')
const app = express()

app.use(cors({
    origin:"http://localhost:3000",
    credentials: true
}))
app.use(express.json())
app.use(fileup())
app.use('/uploads',express.static(path.join(__dirname,'./uploads')))

//global api

const auth = require('./routes/auth')
app.use('/api/auth',auth)

const profile = require('./routes/profile')
app.use ('/api/profile',profile)

//eva api

const selfeva = require('./routes/Eva/selfeva')
app.use('/api/Eva/selfeva',selfeva)

const edit_eva = require('./routes/Eva/edit_eva')
app.use('/api/Eva/edit_eva',edit_eva)

const score_member = require('./routes/Eva/score_member')
app.use('/api/Eva/score_member',score_member)

//คอมมิท

const show_eva = require('./routes/Commit/show_eva')
app.use('/api/Commit/show_eva',show_eva)

app.use((req,res)=> res.status(404).json({message:"Route not Found"}))
app.listen(3001,()=>{
    console.log("Server Running on Port 3001");
    
})