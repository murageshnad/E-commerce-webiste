const mongoose = require('mongoose');

var productDetailSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true

    },
    data: Buffer,
    originalname: String,
    contentType: String,


});
mongoose.model('Product', productDetailSchema);

// const shopDetailmodel = mongoose.model('Shop', shopDetailSchema);
// module.exports = shopDetailmodel;