// Test query for some 
const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('../database_files/inventory.db');

const sql = `SELECT * from Inventory LIMIT 10 OFFSET 0`;

db.all(sql, function(err, rows) {
    if (err) {
        throw err;
    }
    rows.forEach(function(row){
        console.log(row);
    })
})