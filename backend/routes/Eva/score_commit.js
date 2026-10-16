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

router.get('/score',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member =req.user.id_member
        const [[evaRow]] = await db.query(`select * from tb_member m,tb_eva e,tb_system s where e.id_member=? and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,[id_member]) 
        const id_eva = evaRow.id_eva
        const [rows] = await db.query(`select i.id_indicate,i.point_indicate,d.status_eva,d.score_commit  from tb_indicate i join tb_evadetail d on d.id_indicate=i.id_indicate where d.id_eva and d.id_eva=? and status_eva in (2,3,4) order by d.id_indicate `,[id_eva])
        const scores = {}
        rows.map(row=>{
            if(!scores[row.indicates]){
                scores[row.indicates] = {
                    a:null,
                    b:null,
                    c:null,
                }
            }
            if(row.status_eva === 2)scores[row.id_indicate].a = row.score_commit*row.point_indicate
            if(row.status_eva === 3)scores[row.id_indicate].b = row.score_commit*row.point_indicate
            if(row.status_eva === 4)scores[row.id_indicate].c = row.score_commit*row.point_indicate
        })
        res.json({scores})
    } catch (error) {
        console.error('ERROR GET SCORES',error)
        res.status(500).json({message:'ERROR GET SCORES'})
    }
})
module.exports = router