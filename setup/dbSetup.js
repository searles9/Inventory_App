const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('../database_files/inventory.db');

sql = `CREATE TABLE IF NOT EXISTS Inventory (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       item TEXT UNIQUE,
       quantity INTEGER,
       price REAL
       )`;

db.run(sql,[], function(err) {
    if (err) {
        return console.log(err.message)
    }
    console.log('Database "Inventory" was created. Closing db file.')
});


db.close();