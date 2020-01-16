const mongoose = require('mongoose')
const Schema = mongoose.Schema

let redeemSchema = new Schema({
    senderMobileNo: String,
    senderName: String,
    gift: [String],
    balanceCoin: Number,
    giftTotalValue: [Number],
    status: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('redeemSchema', redeemSchema) 