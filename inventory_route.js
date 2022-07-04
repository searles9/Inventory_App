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


inventoryRouter.get('/totalItems', (req, res, next) => {
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

module.exports = inventoryRouter;