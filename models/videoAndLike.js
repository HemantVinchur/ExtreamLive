const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let uploadVideoLikeSchema = new Schema({
    competitionId:String ,
    videoUrl: String,
    mobileNo: String,
    profilePic: String,
    fullName: String,
    likeCounter: { type: Number, default: 0 },
    likes: [{
        likedBy: String,
        fullName: String,
        profilePic: String,
        isLike: { type: Boolean, default: false },
    }],
    followingMobileNo: [{
        mobileNo: String,
    }],
    createdAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('videoAndLike', uploadVideoLikeSchema);