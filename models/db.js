const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/DMARTDB', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});


require('./shop.model');
require('./product.model');
require('./cart.model');
