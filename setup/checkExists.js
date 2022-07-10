const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('../database_files/inventory.db');



// async function itemExistsInTable1 (itemName) {
//     const query = `SELECT * FROM Inventory WHERE item = $itemName LIMIT 1`
  
    
// }

// //itemExistsInTable('Item 0')
// console.log(itemExistsInTable('Item 0'))

function itemExistsInTable (itemName) {
    const query = `SELECT * FROM Inventory WHERE item = $itemName LIMIT 1`
    return new Promise((resolve, reject) => {
        db.get(query, {
            $itemName: itemName
        },function(err, row) {
            if(err) {
                reject(err);
            }
            if (row) {
                resolve(true)
            }
            resolve(false)
          });
    })
}

// let promiseResult = itemExistsInTable('Item 0')
//     .then((result) => {
//         //console.log(result)
//         if (result) {
//             console.log(true)
//         } else {
//             console.log(false)
//         }
//     })


async function test() {
    result = await itemExistsInTable('Item 055')
    if (result) {
        console.log(true)
    } else {
        console.log(false)
    }
}

test()

// itemExistsInTable('Item 0').then(result => {
//     console.log(result)
// })

// const test = itemExistsInTable('Item 0')
// console.log(test)

