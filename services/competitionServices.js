const competition = require('../models/Competition');
const competitionStatus = require('../models/CompetitionStatus');
const adminAuth = require('../models/adminAuth');
const user = require('../models/user');
const prize = require('../models/prize');
const videoAndLike = require('../models/videoAndLike');
const userAuth = require('../models/userAuth');
const follower = require('../models/follower')
const mongoose = require('mongoose');

const addCompetition = async (payload) => {
    try {
        let data = await competition.create(payload);

        let statusData = await competitionStatus.create({ competitionId: data._id })

        return data;

    } catch (error) {
        throw error;
    }
}


const getCompetition = async (params) => {
    try {
        /*   let findData = await competition.find({
               waiting: params.waiting,
               started: params.started,
               voting: params.voting,
               judging: params.judging,
               results: params.results,
           })*/
        let findData = await competition.find();
        return findData;

    } catch (error) {
        throw error;
    }
}


const updateCompetition = async (payload) => {
    try {
        let data = await competition.updateOne({ _id: mongoose.Types.ObjectId(payload._id) },
            {
                $set: {
                    startAt: payload.startAt,
                    endsAt: payload.endsAt,
                    votingStarts: payload.votingStarts,
                    votingEnds: payload.votingEnds,
                    firstPrize: payload.firstPrize,
                    secondPrize: payload.secondPrize,
                    thirdPrize: payload.thirdPrize,
                    termsCondition: payload.termsCondition,
                    url: payload.url,
                }
            }, { new: true });

        return data;

    } catch (error) {
        throw error;
    }
}


const deleteCompetition = async (payload) => {
    try {

        let data = await competition.deleteOne({ _id: mongoose.Types.ObjectId(payload._id) });
        return data;

    } catch (error) {
        throw error;
    }
}
//check
const deleteAllCompetition = async (payload) => {
    try {

        let data = await competition.deleteMany();
        return data;

    } catch (error) {
        throw error;
    }
}


const changeCompetitionStatus = async (payload) => {
    try {
        let data = await competitionStatus.update({ competitionId: payload.competitionId },
            {
                $set: {
                    waiting: payload.waiting,
                    started: payload.started,
                    voting: payload.voting,
                    judging: payload.judging,
                    results: payload.results,
                    ended: payload.ended,
                    cancelled: payload.cancelled,
                    deleted: payload.deleted
                }

            });
        console.log(payload.competitionId)
        let competitionData = await competition.update({ _id: payload.competitionId },
            {
                $set: {
                    waiting: payload.waiting,
                    started: payload.started,
                    voting: payload.voting,
                    judging: payload.judging,
                    results: payload.results,
                    ended: payload.ended,
                    cancelled: payload.cancelled,
                    deleted: payload.deleted
                }
            }, { new: true });

        return { data };

    } catch (error) {
        throw error;
    }
}

const addCompetitionVideo = async (payload, token) => {
    try {

        let competitionData = await competition.findOne({ _id: mongoose.Types.ObjectId(payload.competitionId) });
        /*   if (!competitionData) {
               throw new Error("competition is not exist")
           }*/
        let authData = await userAuth.findOne({ accessToken: token });
        let userData = await user.findOne({ mobileNo: authData.mobileNo });
        if (!userData) {
            throw new Error("user is not exist")
        }

        let followerData = await follower.findOne({
            mobileNo: userData.mobileNo,
            followingMobileNo: { $elemMatch: {} }
        });
       // console.log(followerData.followingMobileNo);
        let newData = {
            competitionId: payload.competitionId,
            videoUrl: payload.videoUrl,
            mobileNo: userData.mobileNo,
            profilePic: userData.profilePic,
            fullName: userData.fullName,
            likeCounter: payload.likeCounter,
            likes: {},
            followingMobileNo:followerData.followingMobileNo 
        }
        let videoData = await videoAndLike.create(newData);

        return { videoData }

    } catch (error) {
        throw error;
    }
}

//user
const getCompetitionVideo = async () => {
    try {

        let videoData = await videoAndLike.find().sort({ "createdAt": -1 });
        //   console.log(videoData[1]._id);
        console.log(videoData);
        return { videoData }
    } catch (error) {
        throw error;
    }
}


//get competition video for particular person
const getUserCompetitionVideo = async (params) => {
    try {

        let videoData = await videoAndLike.find({ mobileNo: params.mobileNo });
        console.log(videoData);
        console.log(videoData);
        return { videoData }
    } catch (error) {
        throw error;
    }
}


//user

const getAllCompetitionVideo = async (token) => {
    try {
        let authData = await userAuth.findOne({ accessToken: token });

        let findUser = await user.findOne({ mobileNo: authData.mobileNo });

        let find = await videoAndLike.find();
        //let videoData
        //      for (i = 0; i < find.length - 1; i++) {

        let videoData = await videoAndLike.find({}).populate({ path: '_id', model: 'videoAndLike' });
        console.log(videoData);
        //    }
        //return videoData
        return find
        /*    let i;
            let criteria ={};
            let userData
            let find
            for (i = 0; i < videoData.length - 1; i++) {
                console.log(i);
                console.log({ _id: mongoose.Types.ObjectId(videoData[i]._id) })
                //   console.log(videoData[i]);
    
                let find = await videoAndLike.find({
                    _id: mongoose.Types.ObjectId(videoData[i]._id),
                });
    
                criteria.push(find);
    
                console.log(criteria);
                //  if (!videoData[i]._id != undefined) {
                  //    criteria.push({ $match: { _id: mongoose.Types.ObjectId(videoData[i]._id) } });
                 // }
                  //console.log(criteria);
      
                   //userData = await videoAndLike.aggregate(criteria);
                //  console.log(userData[videoData.length-1]);
                //  return userData
      
                return find;
            }
      //      console.log('11111')
            // return {userData}
            // return { find }
    */

    } catch (error) {
        throw error;
    }
}

//delete videos
const deleteCompetitionVideos = async (payload) => {
    try {
        let find = await videoAndLike.findOne({ _id: mongoose.Types.ObjectId(payload._id) });
        if (!find) {
            throw Error("no video  found");
        }
        let data = await videoAndLike.deleteOne({ _id: mongoose.Types.ObjectId(payload._id) });
        return data;

    } catch (error) {
        throw error;
    }
}


//user
const addLike = async (payload, token) => {
    try {

        let authData = await userAuth.findOne({ accessToken: token });

        let likedByUser = await user.findOne({ mobileNo: authData.mobileNo });

        let find = await videoAndLike.findOne({
            _id: mongoose.Types.ObjectId(payload.videoId),
            likes: {
                $elemMatch: {
                    likedBy: likedByUser.mobileNo
                }
            }
        });
        if (!find) {
            let updateData = await videoAndLike.updateOne({ _id: mongoose.Types.ObjectId(payload.videoId) },
                {
                    $inc: { likeCounter: 1 },
                    $push: {
                        likes: {
                            likedBy: likedByUser.mobileNo,
                            fullName: likedByUser.fullName,
                            profilePic: likedByUser.profilePic,
                            isLike: true
                        }
                    }

                }, { new: true });


            let find = await videoAndLike.findOne({ _id: mongoose.Types.ObjectId(payload.videoId) })

            return { find }
        }
        else {

            return { find }
        }
    } catch (error) {
        throw error;
    }
}


//user/admin
const getLike = async (query) => {
    try {
        console.log(query);
        console.log(00000000);
        let data = await videoAndLike.findOne({
            _id: mongoose.Types.ObjectId(query.videoId),
        });

        return data

    } catch (error) {
        throw error;
    }
}

//admin
const declareCompetitionWinner = async (payload) => {
    try {
        let data = await prize.create({
            competitionId: payload.competitionId,
            firstPrizeUrl: payload.firstPrizeUrl,
            secondPrizeUrl: payload.secondPrizeUrl,
            thirdPrizeUrl: payload.thirdPrizeUrl,
        })

        return data;

    } catch (error) {
        throw error;
    }
}
//admin
const getDeclareCompetitionWinner = async (params) => {
    try {
        let data = await prize.findOne({ competitionId: params.competitionId });

        return data;

    } catch (error) {
        throw error;
    }
}
//admin
const getSelectedCompetitionVideo = async () => {
    try {
        let data = await Likes.find({}).sort({ "likeCounter": -1 })
            //.skip(1)
            .limit(10);

        return data;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    addCompetition, getCompetition, getAllCompetitionVideo, updateCompetition, deleteCompetition, deleteAllCompetition,
    changeCompetitionStatus, addCompetitionVideo, getCompetitionVideo, getUserCompetitionVideo, deleteCompetitionVideos,
    addLike, getLike, declareCompetitionWinner, getDeclareCompetitionWinner, getSelectedCompetitionVideo
}