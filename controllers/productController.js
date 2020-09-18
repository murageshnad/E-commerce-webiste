const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var User = require('../models/user');
const Shop = mongoose.model('Shop');
const Product = mongoose.model('Product');
var Cart = require("../models/cart.model");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');
var path = require('path');
var multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const sharp = require('sharp')
const { uuid } = require('uuidv4');
var nodemailer = require('nodemailer');

var fs = require('fs');
var dir = './uploads';
var obj = {};

// Multer single file parser
const upload = multer({ limits: { fileSize: 4000000 } }).single('myimage');



// var upload = multer({

//     storage: multer.diskStorage({

//         destination: function (req, file, callback) {
//             if (!fs.existsSync(dir)) {
//                 console.log("inside");
//                 fs.mkdirSync(dir);
//                 console.log("done");
//             }
//             callback(null, './uploads');
//         },
//         filename: function (req, file, callback) {
//             callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//             console.log("filename");
//         }

//     }),

//     fileFilter: function (req, file, callback) {
//         var ext = path.extname(file.originalname)
//         if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
//             console.log("ext");
//             return callback(res.end('Only images are allowed'));
//         }
//         callback(null, true);
//     }
// });



// router.post('/addProduct', async function (req, res) {

//     // if (req.body._id == '') {

//     // }
//     await insertProduct(req, res);
//     console.log("Record inserted");
//     // else {
//     //     //console.log("else part");
//     //     //await updateProduct(req, res);
//     //     console.log("Record Updated");
//     // }

// });

// async function insertProduct(req, res) {
//     var image = {};
//     // image['productName'] = req.payload.productName;
//     // image['productPrice'] = req.payload.productPrice;
//     //image['image'] = req.body.myimage;
//     //console.log("insert query", req.body.productName);
//     //console.log("request", req.payload.productName);
//     // let incomingData = {
//     //     productName: req.payload.productName,
//     //     productPrice: req.payload.productPrice
//     // };
//     // console.log("incomingData", incomingData);

//     //console.log(image['data']);
//     // router.addImage(image, (err, docs) => {
//     //     if (err) {
//     //         console.log(err.message);
//     //         throw err;
//     //     }
//     //     console.log("Successfully inserted one image!");
//     //     res.render("products/home", {

//     //     });

//     // });

// }









router.addImage = function (image, callback) {
    Product.create(image, callback);
};

router.updateImage = function (image, callback) {
    Product.create(image, callback);
};

// router.get('/', (req, res) => {
//     res.render("products/login", {
//         viewTitle: "Login HERE"
//     });
// });

// router.get('/home', (req, res) => {
//     res.render("products/home", {
//         viewTitle: "Login HERE"
//     });
// });

router.get('/addProduct', (req, res) => {
    res.render("products/addProduct", {
        viewTitle: "Add Product"
    });
});

router.get('/modal', (req, res) => {
    res.render("products/modal", {
        viewTitle: "Add Product"
    });
});



// router.get("/listProduct", function (req, res) {
//     console.log("id", req.params.id);
//     Product.findOne({ "_id": req.params.id })
//         .populate("AddedBy")
//         .exec(function (error, data) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log("product", data);
//             }
//         });
// });

router.get('/listProduct', (req, res) => {
    console.log("id", req.params.id);
    Product.find((err, docs) => {
        if (!err) {
            console.log("product list", docs);
            res.render("products/listProduct", {
                listProduct: docs,
                viewTitle: 'List of Products'
            });
        }
        else {
            console.log('Error in retrieving  list :' + err);
        }
    });
});

router.get('/register', (req, res) => {
    res.render("products/register", {
        viewTitle: "Register Here"
    });
});
router.post('/register', function (req, res) {
    console.log("dtat", req.body);
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;


    var newUser = new User({
        username: username,
        email: email,
        password: password,
        isAdmin: true
    });

    User.getUserByUsername(username, function (err, user) {
        if (err) throw err;
        if (user) {
            req.flash('error_msg', 'User Already Exist');
            res.redirect('/home/register');
        } else {
            User.createUser(newUser, function (err, user) {
                if (err) throw err;
                console.log(user._id);
                var shop = new Shop();
                shop.shopName = req.body.shopName;
                shop.shopAddress = req.body.shopAddress;
                shop.shopOwner = req.body.shopOwner;
                shop.createdBy = user._id;
                shop.save((err, docs) => {
                    if (!err) {
                        console.log("inserted===", docs._id);
                    }
                });


            });

            req.flash('success_msg', 'You are registered and can now login');

            res.redirect('/home/login');

        }
    });

});

//Get login
router.get('/login', (req, res) => {
    res.render("products/login", {
        viewTitle: "Login Here"
    });
});


passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            console.log("user", user);
            if (!user || user.isAdmin != true) {
                return done(null, false, { message: 'Unknown Admin' });
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid Password' });
                }
            });
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

//User Login
router.post('/login', passport.authenticate('local', { successRedirect: '/home/index', failureRedirect: '/home/login', failureFlash: true }), function (req, res) {
    res.redirect('/home/index');
});

//User Logout
router.get('/logout', function (req, res, next) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/home/login');
});





router.get('/index', (req, res) => {
    res.render("products/home", {

    });
});






// router.post('/addProduct', upload.single('image'), async (req, res) => {
//     console.log("addproduct --");
//     var product = new Product();
//     var obj = {
//         productName: req.body.productName,
//         productPrice: req.body.productPrice,
//         img: {
//             data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
//             contentType: 'image/png'
//         }
//     };
//     product.save(obj, (err, item) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             console.log("insertedproduct");
//             // item.save(); 
//             //res.redirect('/');
//         }
//     });


// });

// async function insertProduct(req, res) {
//     var product = new Product();
//     product.productName = req.body.productName;
//     product.productPrice = req.body.productPrice;
//     // product.img.data = fs.readFileSync(path.join(__dirname + './images' + req.file.filename));
//     //product.img.contentType = 'image/jpg';
//     product.save((err, doc) => {
//         if (!err)
//             console.log("done-----");
//         else {
//             console.log('Error during record insertion : ' + err);
//         }
//     });
// }
// var storage = multer.memoryStorage();
// var upload = multer({ storage: storage });



// async function insertProduct(req, res) {
//     var product = new Product();
//     var image = {};
//     product.data = req.files[0].buffer;
//     product.originalname = req.files[0].originalname;
//     product.contentType = req.files[0].mimetype;
//     product.productName = req.body.productName;
//     product.productPrice = req.body.productPrice;
//     product.save((err, doc) => {
//         if (err) {
//             console.log(err.message);
//             throw err;
//         }
//         console.log("Successfully inserted one image!");
//         res.render("products/home", {

//         });
//     });
// }

// async function updateProduct(req, res) {
//     Product.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
//         if (err) {
//             console.log(err.message);
//             throw err;
//         }
//         console.log("Successfully updated!");
//         res.render("products/home", {

//         });
//     });
// }





router.post('/updateProduct/:id', (req, res) => {
    console.log("inside", req.body.title);
    console.log("inside", req.body.price);
    console.log("inside", req.body.imagePath);
    Product.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            console.log('updated');
        }
        else {
            console.log('Error during record update : ' + err);
        }
    });

    res.redirect('/home/listProduct');

});







router.post('/addProduct', (req, res) => {
    var objs = {};
    console.log("inside");
    Shop.findOne(req.params.id, (err, doc) => {
        if (!err) {
            console.log('docs', doc._id);
            objs.id = doc._id;
        }
        console.log('docs--', objs.id);
        // everything worked fine
        console.log("productName:", req.body.title);
        console.log("productPrice:", req.body.price);
        console.log('id', obj.id);
        console.log('image done');
        var image = {};
        image['title'] = req.body.title;
        image['price'] = req.body.price;
        image['imagePath'] = req.body.imagePath;
        image['AddedBy'] = objs.id;

        router.addImage(image, (err, docs) => {
            if (err) {
                console.log(err.message);
                throw err;
            }
            console.log("DTata", docs);
            console.log("Successfully inserted one image!");
            res.render("products/home", {

            });

        });

    });

})



router.get('/updateProduct/:id', (req, res) => {
    Product.findById(req.params.id, (err, doc) => {
        if (!err) {
            console.log("Data---", doc);
            //res.json(doc);

            res.render("partials/editForm", {
                Product: doc,
            });

        }
    });
});


router.get('/listProduct/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/home/listProduct');
        }
        else { console.log('Error in  delete :' + err); }
    });
});

router.get('/sold', (req, res) => {
    let obj = {};
    if (!req.session.cart) {
        return res.render("products/soldProducts", {
            products: null
        });
    }
    var cart = new Cart(req.session.cart)
    var totalPrice = cart.totalPrice;

    res.render("products/soldProducts", {
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        viewTitle: 'Sold Products',
    });
});







module.exports = router;
