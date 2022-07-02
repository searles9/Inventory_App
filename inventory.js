const express = require('express');
const inventoryRouter = express.Router();

const tempData = {
    '1': {
      id: 1,
      item: 'Item 1',
      quantity: 2,
      price: 3.99
    },
    '2': {
      id: 2,
      item: 'Item 2',
      quantity: 45,
      price: 3.99
    },
    '3': {
      id: 3,
      item: 'Item 3',
      quantity: 5,
      price: 50
    }
}

inventoryRouter.get('/', (req, res, next) => {
    res.json(tempData)
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