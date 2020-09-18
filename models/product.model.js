const mongoose = require('mongoose');

var productDetailSchema = new mongoose.Schema({
    title: {
        type: String,

    },
    price: {
        type: Number,


    },
    added_date: {
        type: Date,
        default: Date.now
    },
    imagePath: String,
    AddedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
    }



});
mongoose.model('Product', productDetailSchema);

// const shopDetailmodel = mongoose.model('Shop', shopDetailSchema);
// module.exports = shopDetailmodel;