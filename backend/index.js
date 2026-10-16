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

const docnoe =require('./routes/docnoe')
app.use('/api/docnoe',docnoe)

const dash =require('./routes/dash')
app.use('/api/dash',dash)

//eva api

const selfeva = require('./routes/Eva/selfeva')
app.use('/api/Eva/selfeva',selfeva)

const edit_eva = require('./routes/Eva/edit_eva')
app.use('/api/Eva/edit_eva',edit_eva)

const score_member = require('./routes/Eva/score_member')
app.use('/api/Eva/score_member',score_member)

const score_commit = require('./routes/Eva/score_commit')
app.use('/api/Eva/score_commit',score_commit)

const table = require('./routes/Eva/table')
app.use('/api/Eva/table',table)



//staff api
const member = require('./routes/Staff/member')
app.use('/api/Staff/member',member)

const topic = require('./routes/Staff/topic')
app.use ('/api/Staff/topic',topic)

const indicate = require('./routes/Staff/indicate')
app.use ('/api/Staff/indicate',indicate)

const system = require('./routes/Staff/system')
app.use ('/api/Staff/system',system)

const eva = require('./routes/Staff/eva')
app.use ('/api/Staff/eva',eva)

const commit = require('./routes/Staff/commit')
app.use ('/api/Staff/commit',commit)

const doc = require('./routes/Staff/doc')
app.use ('/api/Staff/doc',doc)

const backup = require('./routes/Staff/backup')
app.use ('/api/Staff/backup',backup)

const score_member3 = require('./routes/Staff/score_member')
app.use ('/api/Staff/score_member',score_member3)

const score_commit3 = require('./routes/Staff/score_commit')
app.use ('/api/Staff/score_commit',score_commit3)

const status = require('./routes/Staff/status')
app.use ('/api/Staff/status',status)
//คอมมิท

const show_eva = require('./routes/Commit/show_eva')
app.use('/api/Commit/show_eva',show_eva)

app.use((req,res)=> res.status(404).json({message:"Route not Found"}))
app.listen(3001,()=>{
    console.log("Server Running on Port 3001");
    
})