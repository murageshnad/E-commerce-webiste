require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
var bodyParser = require('body-parser');
var session = require("express-session")
var MongoStore = require("connect-mongo")(session)
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var connectFlash = require('connect-flash');
//var expressSession = require('express-session');
var session = require("express-session");
var passport = require('passport');
var MongoStore = require("connect-mongo")(session)
var LocalStrategy = require('passport-local').Strategy;
mongoose.connect('mongodb://localhost:27017/DMARTDB', { useMongoClient: true });
var fs = require('fs');
var multer = require('multer');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const productController = require('./controllers/productController');
//const user = require('./controllers/user');



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
//app.use(express.static('uploads'));
app.use(
    session({
        secret: "mysupersecret",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        cookie: { maxAge: null }
    })
)
//Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());

//Express validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        return {
            param: param,
            msg: msg,
            value: value
        };
    }
}));

//Connect flash
app.use(connectFlash());

//Global vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.host = 'http://localhost:' + app.get('port');
    next();
});
app.set('port', 5000);
app.listen(app.get('port'), function () {
    console.log('Server started at : http://localhost:' + app.get('port'));
});


// app.listen(4040, () => {
//     console.log('Express server started at port : 4040');
// });



app.use('/home', productController);
//app.use('/admin', user);


