const express = require('express')
const path =require('path')
const jwt = require('jsonwebtoken')
const uploadDir = path.join(__dirname,'../../uploads/file_eva')
const JWT_SECRET = process.env.JWT_SECRET
const bc = require('bcrypt')
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const router = express.Router()


router.get('/topic',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member =req.user.id_member
        const [topics] = await db.query(`select * from tb_topic`)
        const [[evaRow]] = await db.query(`select * from tb_member m,tb_eva e,tb_system s where e.id_member=? and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,[id_member]) 
        const id_eva = evaRow.id_eva
        const [indicates] = await db.query(`select * from tb_indicate i,tb_evadetail d where d.id_indicate=i.id_indicate and d.id_eva=? and status_eva=2 order by i.id_topic=d.id_indicate `,[id_eva])
        const result = topics.map(t=>({
            ...t, indicates:indicates.filter((i)=> i.id_topic === t.id_topic)
        }))
        res.json(result)
    } catch (error) {
        console.error('ERROR GET TOPICS',error)
        res.status(500).json({message:'ERROR GET TOPICS'})
    }
})


module.exports = router