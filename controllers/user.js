const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Shop = mongoose.model('Shop');
const Product = mongoose.model('Product');
var Cart = require("../models/cart.model");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;




module.exports = router;
