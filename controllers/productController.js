const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Shop = mongoose.model('Shop');
const Product = mongoose.model('Product');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const sharp = require('sharp')
const { uuid } = require('uuidv4');

var fs = require('fs');
var dir = './uploads';

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


router.post('/addProduct', (req, res) => {
    console.log("inside");

    upload(req, res, async function (err) {
        console.log("inside upload");
        // check for error
        if (err || req.file === undefined) {
            console.log("error", err);
            res.send("error occured");
        } else {
            // everything worked fine
            console.log("productName:", req.body.productName);
            console.log("productPrice:", req.body.productPrice);
            console.log("req.file", req.file.originalname);
            let fileName = uuid() + ".jpeg";
            console.log("fileName", fileName);
            var image = await sharp(req.file.buffer)
                //.resize({ width: 400, height:400 }) Resize if you want
                .jpeg({
                    quality: 40,
                }).toFile('./uploads/' + fileName)
                .catch(err => { console.log('error: ', err) })
            console.log('image done');
            var image = {};
            image['productName'] = req.body.productName;
            image['productPrice'] = req.body.productPrice;
            image['image'] = req.file.originalname;
            image['fileName'] = fileName;

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


            //res.send(req.body)
        }
    })
})


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

router.get('/', (req, res) => {
    res.render("products/login", {
        viewTitle: "Login HERE"
    });
});

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

router.get('/listProduct', (req, res) => {
    Product.find((err, docs) => {
        if (!err) {
            //console.log("data", docs);
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




router.get('/home', (req, res) => {
    res.render("products/home", {

    });
});


router.post('/', async (req, res) => {
    User.find((err, docs) => {
        if (req.body.email === docs[0].email && req.body.password === docs[0].password) {

            console.log('sucess');
            res.render("products/home", {

            });
        }
        else {
            res.render("products/login", {
                viewTitle: "Invalid Admin"

            });
        }
    });

});


// async function insertRecord(req, res) {
//     var admin = new Admin();
//     admin.email = req.body.email;
//     admin.password = req.body.password;

//     admin.save((err, doc) => {
//         if (!err)
//             console.log("done-----");
//         else {
//             console.log('Error during record insertion : ' + err);
//         }
//     });
// }\

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





router.post('/addproduct/:id', (req, res) => {
    console.log("inside");

    upload(req, res, async function (err) {
        console.log("inside upload");
        console.log("productName:", req.file);
        // check for error
        if (err || req.file === undefined) {
            console.log("error", err);
            res.send("error occured");
        } else {
            // everything worked fine
            console.log("productName:", req.body.productName);
            console.log("productPrice:", req.body.productPrice);
            console.log("req.file", req.file.originalname);
            let fileName = uuid() + ".jpeg";
            console.log("fileName", fileName);
            var image = await sharp(req.file.buffer)
                //.resize({ width: 400, height:400 }) Resize if you want
                .jpeg({
                    quality: 40,
                }).toFile('./uploads/' + fileName)
                .catch(err => { console.log('error: ', err) })
            console.log('image done');
            var productName = req.body.productName;
            var productPrice = req.body.productPrice;
            var imagepath = req.file.originalname;
            var id = req.body._id;
            console.log("id-------", id);


            Product.updateOne({ productName: productName, productPrice: productPrice, image: imagepath }, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Successfully updated!");
                    res.render("products/home", {

                    });
                }
            });




            //res.send(req.body)
        }
    });

});






router.post('/register', async (req, res) => {
    console.log("post --");
    if (req.body._id == '') {
        await insertRecord(req, res);
        console.log("Record inserted");
    }
    else {
        await updateRecord(req, res);
    }
});


async function insertRecord(req, res) {
    var shop = new Shop();
    var user = new User();
    user.email = req.body.email;
    user.password = req.body.password;
    user.isAdmin = true;
    shop.shopName = req.body.shopName;
    shop.shopAddress = req.body.shopAddress;
    shop.shopOwner = req.body.shopOwner;

    user.save((err, docs) => {

        console.log("docs---", docs._id);
        console.log("inserted---");
        shop.createdBy = docs._id;
        shop.save((err, docs) => {
            if (!err) {
                //console.log("inserted===");
                res.render("products/login", {
                    viewTitle: "Login HERE"
                });
            }
            else {
                console.log('Error during record insertion : ' + err);
            }

        });

    });

}

router.get('/updateProduct/:id', (req, res) => {


    Product.findById(req.params.id, (err, doc) => {
        if (!err) {
            console.log("Data---", doc);
            //res.json(doc);

            res.render("partials/editForm", {
                Product: doc,
                //img_src: base64img.base64Sync('/public/camera2.jpg'),

            });
            // res.render("products/addProduct", {
            //     viewTitle: "Update Product",

            //     Product: [
            //         {
            //             productName: doc.productName,
            //             productPrice: doc.productPrice
            //         },
            //     ]
            // });



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






module.exports = router;
