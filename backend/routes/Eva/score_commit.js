const express = require('express')
const path =require('path')
const jwt = require('jsonwebtoken')
const uploadDir = path.join(__dirname,'../../uploads/file_eva')
const JWT_SECRET = process.env.JWT_SECRET
const bc = require('bcrypt')
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const router = express.Router()

router.get('/commit',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const [rows ] = await db.query(`select * from tb_member m,tb_eva e,tb_system s,tb_commit c where e.id_member=? and c.id_member=m.id_member and c.id_eva=e.id_eva and e.id_sys=s.id_sys order by e.id_eva desc`,[id_member])
        res.json(rows)
    } catch (error) {
        console.error('ERROR GET USER',error)
        res.status(500).json({message:'ERROR GET USER'})
    }
})

router.get('/score',verifyToken,requireRole('ผู้รับการประเมินผล'))
module.exports = router