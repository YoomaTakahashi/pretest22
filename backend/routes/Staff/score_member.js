const express = require('express')
const path =require('path')
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const router = express.Router()


router.get('/topic/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const {id_eva} = req.params
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate i,tb_evadetail d where d.id_indicate=i.id_indicate and d.id_eva=?  and status_eva in (1) order by i.id_topic=d.id_indicate `,[id_eva])
        const result = topics.map(t=>({
            ...t, indicates:indicates.filter((i)=> i.id_topic === t.id_topic)
        }))
        res.json(result)
    } catch (error) {
        console.error('ERROR GET TOPICS',error)
        res.status(500).json({message:'ERROR GET TOPICS'})
    }
})

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


module.exports = router