// Will contain the inventory router
const express = require('express');
const app = express();
const inventoryRouter = require('./inventory_route')
const bodyParser = require('body-parser');
const path = require('path')
const PORT = 8080;
const db = require('./db.js');
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, './website')))
app.use('/inventory', inventoryRouter)


app.get('/',function(req,res) {
    res.sendFile(__dirname + '/website/index.html')
})

app.use((err, req, res, next) => {
    if (!err.status) {
      err.status = 500;
    }
    res.status(err.status).send(err.message);
  });
