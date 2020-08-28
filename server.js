require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const bodyparser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const productController = require('./controllers/productController');



var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs',
    exphbs(
        {
            extname: 'hbs', defaultLayout: 'default',
            layoutsDir: __dirname + '/views/layouts/',
            handlebars: allowInsecurePrototypeAccess(Handlebars)
        }));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '..', 'public')));





app.listen(4000, () => {
    console.log('Express server started at port : 4000');
});

app.use('/login', productController);

app.use('/home', productController);


