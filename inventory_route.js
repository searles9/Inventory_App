const express = require('express');
const inventoryRouter = express.Router();
const db = require('./db.js');

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

function addSpacesToUrl(url) {
  return url.replace("%20", " ")
}


inventoryRouter.get('/', (req, res, next) => {
  // offset - what row to start at 
  // limit - how many results to return
  const query = `SELECT * from Inventory ORDER BY id ASC LIMIT $limit OFFSET $offset`; 
  let limit = req.query.limit
  let offset = ((req.query.page - 1)  * limit) 

  db.all(query, {$limit: limit, $offset: offset, }, function(err, rows) {
    if(err) {
        throw err;
    }
    res.json(rows)
  })

})

inventoryRouter.post('/add',async function(req,res,next) {
  const item = req.body;

  itemExists = await itemExistsInTable(item.item)
  if (itemExists) {
    const error = new Error(`"${item.item}" item already exists. Update the item instead!`)
    error.status = 409;
    return next(error);
  } 


  let sql = `INSERT INTO Inventory (item, quantity, price) 
    VALUES ($item, $quantity, $price)`;

  db.run(sql,{
      $item: item.item,
      $quantity: item.quantity,
      $price: item.price
  }, function(err) {
      if (err) {
        console.log('SERVER SIDE ERROR - Unable to add item')
        const error = new Error('Unable to add item!')
        error.status = 400;
        return next(error);
      }
      res.json({'rowId':this.lastID})
    })
})

inventoryRouter.put('/update',async function(req,res,next) {
  const item = req.body;

  itemExists = await itemExistsInTable(item.item)
  if (!itemExists) {
    const error = new Error(`"${item.item}" does not exist. Add the item instead!`)
    error.status = 404;
    return next(error);
  } 

  sql = `UPDATE Inventory
         SET quantity = $quantity,
         price = $price
         WHERE
         item = $item`

  db.run(sql,{
          $item: item.item,
          $quantity: item.quantity,
          $price: item.price
  }, function(err) {
    if (err) {
      console.log('SERVER SIDE ERROR - Unable to update item')
      const error = new Error('Unable to update item!')
      error.status = 400;
      return next(error);
    }
    res.json({'rowId':this.lastID})
  })

})

inventoryRouter.delete('/delete/:item',async function(req,res,next) {
  item = addSpacesToUrl(req.params.item)

  itemExists = await itemExistsInTable(item)
  if (!itemExists) {
    const error = new Error(`"${item}" item does not exist. Nothing to delete!`)
    error.status = 404;
    return next(error);
  } 

  sql = `DELETE FROM Inventory WHERE item = "${item}"`

  db.run(sql,{
    $item: item.item
  }, function(err) {
  if (err) {
    console.log(err)
    console.log('SERVER SIDE ERROR - Unable to delete item')
    const error = new Error('Unable to delete item!')
    return next(error);
  }
  res.json({'rowId':this.lastID})
  })    
})


inventoryRouter.get('/facts/totalItems', (req, res, next) => {
  const query = `SELECT COUNT(*) FROM Inventory`;
  db.get(query, function(err, row) {
    if(err) {
        throw err;
    }
    res.json({
      totalItems: row["COUNT(*)"]
    })
  });

})

inventoryRouter.get('/facts/totalQuantity', (req, res, next) => {
  const query = `SELECT SUM(quantity) FROM Inventory`;
  db.get(query, function(err, row) {
    if(err) {
        throw err;
    }
    res.json({
      totalItems: row["SUM(quantity)"]
    })
  });

})

inventoryRouter.get('/facts/mostInStock', (req, res, next) => {
  const query = `SELECT *, MAX(quantity) FROM Inventory`;
  db.get(query, function(err, row) {
    if(err) {
        throw err;
    }
    res.json({
      mostInStock: row['item']
    })
  });

})

inventoryRouter.get('/facts/leastInStock', (req, res, next) => {
  const query = `SELECT *, MIN(quantity) FROM Inventory`;
  db.get(query, function(err, row) {
    if(err) {
        throw err;
    }
    res.json({
      leastInStock: row['item']
    })
  });

})

module.exports = inventoryRouter;