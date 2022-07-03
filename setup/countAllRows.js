// Check how many rows are in the table 


const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('../database_files/inventory.db');

const query = `SELECT COUNT(*) FROM Inventory`

db.get(query, function(err, row) {
    if(err) {
        throw err;
    }
    console.log(row["COUNT(*)"])
});
