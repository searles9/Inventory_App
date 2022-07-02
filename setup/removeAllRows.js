const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('../database_files/inventory.db');



const sql = "DELETE FROM Inventory";

db.run(sql, function(err) {
    if (err) {
        return console.log(err.message)
    }
    console.log(`Removed all rows from the database.`)
})

const sql2 = `UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='Inventory';`;
db.run(sql2, function(err) {
    if (err) {
        return console.log(err.message)
    }
    console.log(`Set the ID back to 0.`)
})