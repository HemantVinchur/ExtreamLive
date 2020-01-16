const mongoose = require('mongoose')
const Schema = mongoose.Schema

let coin = new Schema({
    mobileNo: String,
    fullName: String,
    balance: Number,
    totalCoins:Number,
    coins: [{
        coinId: String,
        coinPrice: Number,
        numberOfCoin: Number,
        coinImage: String,
        coinDetails: String
    }],
    // gifts:
    paymentMethod: { type: String, default: null },
    transectionNo: { type: String, default: null },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('coinHistory', coin) 