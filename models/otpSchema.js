const mongoose = require('mongoose')
const Schema = mongoose.Schema

let otpSchema = new Schema({
    mobileNo: String,
    otp: Number,
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('otpSchema', otpSchema)   

