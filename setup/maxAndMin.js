const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('../database_files/inventory.db');

const query = `SELECT * FROM Inventory WHERE quantity = 
( SELECT MAX(quantity) FROM Inventory)`

db.get(query, function(err, row) {
    if(err) {
        throw err;
    }
    console.log(row)
});

const query2 = `SELECT * FROM Inventory WHERE quantity = 
( SELECT MIN(quantity) FROM Inventory)`

db.get(query2, function(err, row) {
    if(err) {
        throw err;
    }
    console.log(row)
});

db.close()