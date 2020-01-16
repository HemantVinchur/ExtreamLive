const mongoose = require('mongoose')
const Schema = mongoose.Schema

let giftExchangeSchema = new Schema({
   
    giftId: String,
    image: String,
    image_details: String,
    image_price: Number,


    senderMobileNo: String,
    senderName: String,
    senderTotalCoin: Number,

    receiverMobileNo: String,
    receiverName: String,
    receiverTotalCoin: Number,

    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('giftExchange', giftExchangeSchema)