const mongoose = require('mongoose')
const Schema = mongoose.Schema

let imageSchema = new Schema({
    mobileNo: String,
    url: String,
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('imageSchema', imageSchema) 