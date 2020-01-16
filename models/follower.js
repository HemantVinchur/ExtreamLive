const mongoose = require('mongoose')
const Schema = mongoose.Schema

let followerSchema = new Schema({
  mobileNo: Number,
  followerMobileNo: [{
    mobileNo: String,
    fullName: String,
    profilePic: String,
 //   isFollow:{ type: Number, default: 0 }
  }],
  followingMobileNo: [{
    mobileNo: String,
    fullName: String,
    profilePic: String,
  //  isFollow:{ type: Number, default: 0 },
  }]
})


module.exports = mongoose.model('followerSchema', followerSchema)