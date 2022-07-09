const express = require('express');
const inventoryRouter = express.Router();
const db = require('./db.js');


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

inventoryRouter.post('/add',function(req,res,next) {
  const item = req.body;
  console.log(item)
  let sql = `INSERT INTO Inventory (item, quantity, price) 
    VALUES ($item, $quantity, $price)`;

  db.run(sql,{
      $item: item.item,
      $quantity: item.quantity,
      $price: item.price
  }, function(err) {
      if (err) {
        const error = new Error('Unable to add item!')
        error.status = 400;
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