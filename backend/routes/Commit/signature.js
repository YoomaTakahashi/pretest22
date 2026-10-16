const express = require('express')
const path =require('path')
const uploadDir = path.join(__dirname,'../../uploads/signature')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const fs = require('fs')
const db = require('../../db')
const router = express.Router()


router.get('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(`select * from tb_commit where id_eva=? and id_member=?`,[id_eva,id_member])
        res.json(rows[0])
    } catch (error) {
        console.error("Error get",error);
        res.status(500).json({message:"Error get"})   
    }
})
router.post('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try {
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const file = req.files?.file
        const maxSize = 10*1024*1024
        const {name_doc} = req.body
        if(file.size > maxSize){
            return res.status(400).json({message:"ไฟล์มีขนาดเกิน 10MB"})
        }
        const filename = Date.now() + path.extname(file.name)
        await file.mv(path.join(uploadDir,filename))
        await db.query(`update tb_commit set signature=? where id_eva=? and id_member=?`,[filename,id_eva,id_member])
        const [SumCommit] = await db.query(`select * from tb_commit where status_commit=? and signature!='${null}' and id_eva=? `,['y',id_eva])
        if(SumCommit.length === 3){
            await db.query(`update tb_eva set status_eva=? where id_eva=?`,[3,id_eva])
        }
        res.status(201).json({message:'Uploads Succes !!!'})
    } catch (error) {
        console.error("save error",error);
        res.status(500).json({message:"save error"}) 
    }
    
})
router.delete('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try {
        
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [[d]] = await db.query(`select signature from tb_commit where id_eva=? and id_member=?`,[id_eva,id_member])
        res.status(201).json({message:'Uplaods SUCCESS!!!'})
        const fp = path.join(uploadDir,d.signature)
        if(fs.existsSync(fp)){
            fs.unlinkSync(fp)
        }
        await db.query(`update tb_commit set signature=? where id_eva=? and id_member=? `,[null,id_eva,id_member])
        res.json({message:'del SUCCESS!!!'})
    } catch (error) {
        console.error("del error",error);
        res.status(500).json({message:"del error"}) 
    }
    
})



module.exports = router