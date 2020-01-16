const mongoose = require('mongoose');
const Schema = mongoose.Schema

let setCoinSchema = new Schema({
    coinPrice: Number,
    numberOfCoin: Number,
    coinImage: String,
    coinDetails: String
})

module.exports =mongoose.model('setCoin',setCoinSchema);