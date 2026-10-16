const express = require('express')
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const router = express.Router()


router.get('/show/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const {id_eva} = req.params
        const [rows ] = await db.query(`select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_eva=? and c.id_member=m.id_member and c.id_eva=e.id_eva`,[id_eva])
        res.json(rows)
    } catch (error) {
        console.error('ERROR GET ',error)
        res.status(500).json({message:'ERROR GET'})
    }
})

module.exports = router
