const mysql = require('mysql2')
const pool = mysql.createPool({
    host:"mysql",
    user:"root",
    password:"1234",
    database:"pretest22"
})

module.exports = pool.promise()