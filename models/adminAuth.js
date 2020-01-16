const mongoose = require('mongoose')
const Schema = mongoose.Schema

let adminAuthSchema = new Schema({
    email: String,
    accessToken:String,
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('adminAuth', adminAuthSchema) 