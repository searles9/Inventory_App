// Will contain the inventory router
const express = require('express');
const app = express();
const inventoryRouter = require('./inventory')
const bodyParser = require('body-parser');
const path = require('path')
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '/website')))
app.use('/inventory', inventoryRouter)


app.get('/',function(req,res) {
    res.sendFile(__dirname + '/website/index.html')
})

