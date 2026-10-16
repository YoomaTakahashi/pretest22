const express = require('express')
const db = require("../db")
const router = express.Router()

router.get('/',async (req,res) => {
    try {
        const [rows] = await db.query(`select * from tb_doc`)
        res.json(rows)
    } catch (error) {
        console.error('ERROR GET PROFILE',error)
        res.status(500).json({message:'ERROR GET PROFILE'})
    }
})
module.exports = router