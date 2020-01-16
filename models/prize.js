const mongoose = require('mongoose')
const Schema = mongoose.Schema
autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);
let giftSchema = new Schema({
   gift_id: Number,
   image: String,
   image_details: String,
   image_price: String,
   createdAt: { type: Date, default: Date.now() }
})
giftSchema.plugin(autoIncrement.plugin,
   {
       model: 'giftSchema',
       field: 'gift_id',
       startAt: 1,
       incrementBy: 1
   });
module.exports = mongoose.model('giftSchema', giftSchema)
