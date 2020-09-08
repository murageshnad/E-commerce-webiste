const mongoose = require('mongoose');

var productDetailSchema = new mongoose.Schema({
    productName: {
        type: String,

    },
    productPrice: {
        type: Number,


    },
    added_date: {
        type: Date,
        default: Date.now
    },
    image: String,
    fileName: String,


});
mongoose.model('Product', productDetailSchema);

// const shopDetailmodel = mongoose.model('Shop', shopDetailSchema);
// module.exports = shopDetailmodel;