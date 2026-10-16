const express = require('express')
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const mysql2 = require('mysql2')
const router = express.Router()

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const [rows] = await db.query(`SELECT TABLE_NAME AS name FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_TYPE='BASE TABLE'`)
        res.json(rows)
    } catch (error) {
        console.error("Error get",error);
        res.status(500).json({message:"Error get"})        
    }
    
})


router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
       const request = req.body?.tables
       if(!Array.isArray(request) || request.length === 0 || request.some(name => typeof name !== 'string')){
            return res.status(400).json({message:'กรุณาเลือกตาราง'})
       }
       const [avaiRows] = await db.query(`select TABLE_NAME AS name from information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_TYPE='BASE TABLE'`)
       const avaitables = new Set(avaiRows.map(row => row.name))
       const tables = [...new Set(request)]
       if(tables.some(table=> !avaitables.has(table))){
        return res.status(400).json({message:"ไม่พบตารางที่เลือก"})
       }
       const quote = value => `\`${value.replace(/`/g,'``')}\``
       const dump = [
        `-- NTC EVALUATION SYSTEM database backup`,
        `-- Generate at ${new Date().toISOString()}`,
        `SET NAMES utf8mb4;`,
        `SET FOREIGN_KEY_CHECKS=0;`,
        ''
       ]
       for(const table of tables){
        const quotetable = quote(table)
        const [create] = await db.query(`SHOW CREATE table ${quotetable}`)
        dump.push(`-- Structure for table ${table}`)
        dump.push(`DROP TABLE IF EXISTS ${quotetable};`)
        dump.push(`${create[0]['Create Table']};`)

        const [rows] = await db.query(`SELECT * FROM ${quotetable}`)
        if(rows.length > 0){
            const col = Object.keys(rows[0])
            const colList = col.map(quote).join(', ')
            const placeholders = col.map(()=> '?').join(', ')
            const insert = `insert into ${quotetable} (${colList}) values(${placeholders})`
            dump.push(`-- Data for table ${table}`)
            for(const row of rows){
                dump.push(`${mysql2.format(insert,col.map(col => row[col]))};`)
            }
        }
        dump.push('')
       }
       dump.push('SET FOREIGN_KEY_CHECKS=1;')
       res.setHeader('Content-Type','application/sql; charset=utf-8')
       res.setHeader('Content-Diposition','attachment; filename="database-backup.sq;"')
       res.send(dump.join('\n'))
    } catch (error) {
        console.error("Error export",error);
        res.status(500).json({message:"Error export"})        
    }
    
})

module.exports = router