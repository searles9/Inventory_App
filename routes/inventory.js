const express = require('express');
const inventoryRouter = express.Router();
const db = require('../services/db')



inventoryRouter.get('/', (req, res, next) => {
  // offset - what row to start at 
  // limit - how many results to return
  const query = `SELECT * from Inventory OFFSET $offset LIMIT $limit`; 
  let limit = req.query.limit
  let offset = req.query.page === 1 ? 0 : (req.query.page  * limit)

  db.all(query, {
    $offset: offset,
    $limit: limit
  }, function(err, rows) {
    if(err) {
        throw err;
    }
    res.json(rows)
  })
})

inventoryRouter.get('/:item', (req, res, next) => {
    const item = tempData[req.params.item]
    if (item) {
        res.json(item)
    } else {
        res.status(404).send();
    }
})

module.exports = inventoryRouter;