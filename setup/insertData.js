const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('../database_files/inventory.db');


async function addRow (rowObj) {
    let sql = `INSERT INTO Inventory (item, quantity, price) 
    VALUES ($item, $quantity, $price)`;

    db.run(sql,{
        $item: rowObj.item,
        $quantity: rowObj.quantity,
        $price: rowObj.price
    }, function(err) {
        if (err) {
            return console.log(err.message)
        }
        //console.log(`Row ready: ${this.lastID}`)
    })
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomFloat(min,max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

async function addAllRows(numOfRows) {
    console.log('Inserting rows')
    for (let step = 0; step < numOfRows; step++) {
        let dbRow = {
            item: `Item ${step}`,
            quantity: getRandomInt(500),
            price: getRandomFloat(0,100)
        }
        await addRow(dbRow)
    }
    db.close()
}

addAllRows(70)


