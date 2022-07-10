const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('../database_files/inventory.db');

async function test1 (itemName) {
    const query = `SELECT * FROM Inventory WHERE item = $itemName LIMIT 1`
    await db.get(query, {
        $itemName: itemName
    },function(err, row) {
        if(err) {
            reject(err);
        }
        if (row) {
            return true
        }
        return false 
      });
}

async function test2(itemName) {
    return await test1('Item 0')
}

result = await test2('Item 0')
console.log(result)