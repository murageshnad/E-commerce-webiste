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

router.get('/listProduct', (req, res) => {
    Product.find((err, docs) => {
        if (!err) {
            //console.log("data", docs);
            res.render("products/listProduct", {
                image: 'data:image/png;base64,' + base64ArrayBuffer(docs.data),
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
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.post('/addProduct', upload.any(), async function (req, res) {

    if (req.body._id == '') {
        await insertProduct(req, res);
        console.log("Record inserted");
    }
    else {
        //await updateProduct(req, res);
        console.log("Record Updated");
    }
    // var image = {};
    // image['data'] = req.files[0].buffer;
    // image['originalname'] = req.files[0].originalname;
    // image['contentType'] = req.files[0].mimetype;
    // image['productName'] = req.body.productName;
    // image['productPrice'] = req.body.productPrice;

    // console.log(image['data']);
    // router.addImage(image, (err, docs) => {
    //     if (err) {
    //         console.log(err.message);
    //         throw err;
    //     }
    //     console.log("Successfully inserted one image!");
    //     res.render("products/home", {

    //     });

    // });
});

async function insertProduct(req, res) {
    var product = new Product();
    var image = {};
    product.data = req.files[0].buffer;
    product.originalname = req.files[0].originalname;
    product.contentType = req.files[0].mimetype;
    product.productName = req.body.productName;
    product.productPrice = req.body.productPrice;
    product.save((err, doc) => {
        if (err) {
            console.log(err.message);
            throw err;
        }
        console.log("Successfully inserted one image!");
        res.render("products/home", {

        });
    });
}

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




router.post('/addproduct/:id', upload.any(), async function (req, res) {

    // var image = {};
    // image['data'] = req.files[0].buffer;
    // image['originalname'] = req.files[0].originalname;
    // image['contentType'] = req.files[0].mimetype;
    // image['productName'] = req.body.productName;
    // image['productPrice'] = req.body.productPrice;

    // console.log(image['data']);
    // router.updateImage(image, (err, docs) => {
    //     if (err) {
    //         console.log(err.message);
    //         throw err;
    //     }
    //     console.log("Successfully inserted one image!");
    //     res.render("products/home", {

    //     });
    // });
    Product.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (err) {
            console.log(err.message);
            throw err;
        }
        console.log("Successfully updated!");
        res.render("products/home", {

        });
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
                console.log("inserted===");
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

router.get('/addproduct/:id', (req, res) => {

    // res.render("products/addProduct", {
    //     viewTitle: "Update Product",

    // });
    Product.findById(req.params.id, (err, doc) => {
        if (!err) {
            console.log("Data", doc);
            res.render("products/addProduct", {
                viewTitle: "Update Product",
                Product: doc
            });
        }
    });
});


router.get('/listProduct/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            console.log("Data", doc);
            res.render("products/listProduct", {
                viewTitle: "List of Products",

            });
        }
    });
});





function base64ArrayBuffer(arrayBuffer) {
    let base64 = '';
    const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    const bytes = new Uint8Array(arrayBuffer);
    const byteLength = bytes.byteLength;
    const byteRemainder = byteLength % 3;
    const mainLength = byteLength - byteRemainder;

    let a;
    let b;
    let c;
    let d;
    let chunk;

    // Main loop deals with bytes in chunks of 3
    for (let i = 0; i < mainLength; i += 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63;        // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder === 1) {
        chunk = bytes[mainLength];

        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1

        base64 += `${encodings[a]}${encodings[b]}==`;
    } else if (byteRemainder === 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1

        base64 += `${encodings[a]}${encodings[b]}${encodings[c]}=`;
    }

    return base64;
}

module.exports = router;
