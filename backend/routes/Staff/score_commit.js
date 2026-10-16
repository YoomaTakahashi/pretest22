const express = require('express')
const path =require('path')
const jwt = require('jsonwebtoken')
const uploadDir = path.join(__dirname,'../../uploads/file_eva')
const JWT_SECRET = process.env.JWT_SECRET
const bc = require('bcrypt')
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const router = express.Router()

router.get('/user/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const {id_eva} = req.params
        const [rows ] = await db.query(`select * from tb_member m,tb_eva e,tb_system s where e.id_eva=? and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,[id_eva])
        res.json(rows[0])
    } catch (error) {
        console.error('ERROR GET USER',error)
        res.status(500).json({message:'ERROR GET USER'})
    }
})
router.get('/commit/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const {id_eva} = req.params
        const [rows ] = await db.query(`select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_eva=? and c.id_member=m.id_member and c.id_eva=e.id_eva and e.id_sys=s.id_sys order by e.id_eva desc`,[id_eva])
        res.json(rows)
    } catch (error) {
        console.error('ERROR GET USER',error)
        res.status(500).json({message:'ERROR GET USER'})
    }
})

router.get('/topic/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate`)
        const result = topics.map(t=>({
            ...t, indicates:indicates.filter((i)=> i.id_topic === t.id_topic)
        }))
        res.json(result)
    } catch (error) {
        console.error('ERROR GET TOPICS',error)
        res.status(500).json({message:'ERROR GET TOPICS'})
    }
})


router.get('/score/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const id_eva = req.params.id_eva
        const [rows] = await db.query(`select i.id_indicate,i.point_indicate,d.status_eva,d.score_commit  from tb_indicate i join tb_evadetail d on d.id_indicate=i.id_indicate where d.id_eva and d.id_eva=? and status_eva in (2,3,4) order by d.id_indicate `,[id_eva])
        const scores = {}
        rows.map(row=>{
            if(!scores[row.id_indicate]){
                scores[row.id_indicate] = {
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