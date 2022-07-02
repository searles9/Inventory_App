const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('../database_files/inventory.db');



const query = "SELECT * from Inventory";

db.all(query, function(err, rows) {
    if(err) {
        throw err;
    }
    rows.forEach(function(row){
        console.log(row);
    })
    db.close()
});