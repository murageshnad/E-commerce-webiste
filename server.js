require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const productController = require('./controllers/productController');



var app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs',
    exphbs(
        {
            extname: 'hbs', defaultLayout: 'default',
            layoutsDir: __dirname + '/views/layouts/',
            handlebars: allowInsecurePrototypeAccess(Handlebars)
        }));
app.set('view engine', 'hbs');
app.use(express.static('./public')); // allows images to be served to user from this directory
app.use(express.static('./uploads/'));






app.listen(4040, () => {
    console.log('Express server started at port : 4040');
});

app.use('/login', productController);

app.use('/home', productController);


