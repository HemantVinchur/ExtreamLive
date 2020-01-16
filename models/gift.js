const mongoose = require('mongoose')
const Schema = mongoose.Schema

let giftSchema = new Schema({
   image: String,
   image_details: String,
   image_price: Number,
   createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('gift', giftSchema)
