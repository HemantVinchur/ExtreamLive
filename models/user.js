const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
    email: { type: String, default: null },
    mobileNo: { type: String, default: null },
    profilePic: { type: String, default: null },
    coverPic: { type: String, default: null },
    // videos: [String],
    gender: { type: String, default: null },
    fullName: { type: String, default: null },
    dob: { type: String, default: null },
    place: { type: String, default: null },
    //accessToken:String,
    passcode: { type: String, default: null },

    balance: { type: Number, default: 0 },
    totalCoins: { type: Number, default: 0 },

    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    recieved: { type: Number, default: 0 },
    purchased: { type: Number, default: 0 },
    redeemed: { type: Number, default: 0 },
    otp: { type: Number, default: 0 },
    salt: String,
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('user', userSchema)