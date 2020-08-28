const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true

    },
    isAdmin: {
        type: Boolean,
        default: false

    },

});

mongoose.model('User', userSchema);
// const Adminmodel = mongoose.model('Admin', adminSchema);
// module.exports = Adminmodel;