const mongoose = require('mongoose');

var shopDetailSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: true
    },
    shopAddress: {
        type: String,
        required: true

    },
    shopOwner: {
        type: String,
        required: true

    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

});
mongoose.model('Shop', shopDetailSchema);

// const shopDetailmodel = mongoose.model('Shop', shopDetailSchema);
// module.exports = shopDetailmodel;