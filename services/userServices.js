const functions = require('../function')
const jwt = require('jsonwebtoken');
const user = require('../models/user')
const userAuth = require('../models/userAuth')
const adminAuth = require('../models/adminAuth')
const follower = require('../models/follower')
const imageSchema = require('../models/imageSchema')
const otpSchema = require('../models/otpSchema');
const videoAndLike = require('../models/videoAndLike');
const giftExchange = require('../models/giftExchange');
const coinHistory = require('../models/coinHistory');
const mongodb = require('mongodb')
var nodemailer = require('nodemailer');

//verify
const userVerify = async (payLoad) => {
    console.log("Get registration")
    try {
        console.log("userRegister")
        console.log(payLoad.mobileNo)
        let find = await user.findOne({ mobileNo: payLoad.mobileNo });
        // let findEmail = await user.findOne({ email: payLoad.email });
        if (!find) {
            otp = Math.floor(1000 + Math.random() * 9000);
            {
                var createOTP = await otpSchema.create({ mobileNo: payLoad.mobileNo, otp: otp })
            }
            if (createOTP) {
                let smtpTransport = nodemailer.createTransport({
                    pool: true,
                    host: 'mail.bityotta.com',
                    port: 465,
                    auth: {
                        user: 'test@bityotta.com',
                        pass: 'testId@123'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                const mailOptions = {
                    from: 'test@bityotta.com',
                    to: payLoad.email,
                    subject: "OTP verification mail",
                    text: "Hi, " + "\n" + "Your OTP is " + otp
                };

                var sendMail = await smtpTransport.sendMail(mailOptions);
            } else {
                var data = "OTP does not created"
            } return { email: payLoad.email, mobileNo: payLoad.mobileNo, otp: otp };

        } else {
            otp = Math.floor(1000 + Math.random() * 9000);
            var updateOTP = await user.updateOne({
                mobileNo: payLoad.mobileNo
            },
                {
                    otp: otp
                });
            if (updateOTP) {
                let smtpTransport = nodemailer.createTransport({
                    pool: true,
                    host: 'mail.bityotta.com',
                    port: 465,
                    auth: {
                        user: 'test@bityotta.com',
                        pass: 'testId@123'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                const mailOptions = {
                    from: 'test@bityotta.com',
                    to: payLoad.email,
                    subject: "OTP verification mail",
                    text: "Hi, " + "\n" + "Your OTP is " + otp
                };

                var sendMail = await smtpTransport.sendMail(mailOptions);
            } else {
                var data = "OTP does not created"
            }
        }
        console.log(sendMail + "...............................................................................................")
        return { email: payLoad.email, mobileNo: payLoad.mobileNo, otp: otp }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//verifyOTP

const verifyOTPServices = async (req, res, payLoad) => {
    try {
        let find = await user.findOne({ mobileNo: payLoad.mobileNo });
        if (!find) {

            let verify = await otpSchema.findOne({ otp: payLoad.otp });
            console.log(verify)
            let token = jwt.sign({ mobileNo: payLoad.mobileNo }, 's3cr3t');
            if (!verify) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "OTP is not correct.",
                    data: {}
                })
            } else {
                let userData = await userAuth.create({ mobileNo: payLoad.mobileNo, accessToken: token });
                /* let updateData = await user.updateOne({ mobileNo: payLoad.mobileNo },
                     {
                         $set: {
                             accessToken: token
                         }
                     }, { new: true })*/
                let newData = { mobileNo: userData.mobileNo, accessToken: userData.accessToken, flag: 0 }
                return res.status(200).json({
                    statusCode: 200,
                    message: "Success",
                    data: { mobileNo: newData.mobileNo, accessToken: newData.accessToken, flag: newData.flag }
                })
            }
        } else {

            let findOTP = await user.findOne({ otp: payLoad.otp });
            let token = jwt.sign({ mobileNo: payLoad.mobileNo }, 's3cr3t');
            if (!findOTP) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "OTP is not correct.",
                    data: {}
                })
            } else {
                let userData = await userAuth.create({ mobileNo: payLoad.mobileNo, accessToken: token });
                let newData = { mobileNo: userData.mobileNo, accessToken: userData.accessToken, flag: 1 }
                return res.status(200).json({
                    statusCode: 200,
                    message: "Success",
                    data: { mobileNo: newData.mobileNo, accessToken: newData.accessToken, flag: newData.flag }
                })
            }

        }

    } catch (error) {
        console.error(error);
        res.status(200).json({
            statusCode: 400,
            message: "Error",
            data: {}
        })
    }
}

//verifyPasscode

const verifyPasscodeServices = async (res, payLoad) => {
    try {
        let find = await user.findOne({ mobileNo: payLoad.mobileNo, otp: payLoad.otp });
        console.log(find)
        if (!find) {
            return res.status(200).json({
                statusCode: 401,
                message: "OTP is not correct.",
                data: {}
            })
        } else {
            return find;
        }
    } catch (error) {
        return res.status(200).json({
            statusCode: 500,
            message: "Something went wrong.",
            data: {}
        })
    }
}



//Registration

const userSignup = async (req, res) => {
    try {
        let payLoad = req.body;
        let findData = await user.findOne({ mobileNo: payLoad.mobileNo });
        if (findData) {
            res.status(200).json({
                statusCode: 400,
                message: "User already registered",
                data: {},
            })
        }
        if (!findData) {
            let hashObj = functions.hashPassword(payLoad.passcode)
            console.log(hashObj)
            delete payLoad.password
            payLoad.salt = hashObj.salt
            payLoad.passcode = hashObj.hash
            let token = jwt.sign({ mobileNo: payLoad.mobileNo }, 's3cr3t');
            let tokenData = await userAuth.create({ mobileNo: payLoad.mobileNo, accessToken: token });
            let userData = await user.create(payLoad);

            let followers = {
                mobileNo: payLoad.mobileNo,
                followerMobileNo: {
                },
                followingMobileNo: {
                }
            }
            let followersData = await follower.create(followers);

            let newData = { mobileNo: userData.mobileNo, profilePic: userData.profilePic, gender: userData.gender, fullName: userData.fullName, dob: userData.dob, place: userData.place, accessToken: tokenData.accessToken, passcode: userData.passcode }
            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: newData,
            })
        } else {
            let findData = await user.findOne({ mobileNo: payLoad.mobileNo });
            return res.status(200).json({
                statusCode: 200,
                message: "User already registered",
                data: findData,
            })
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({
            statusCode: 400,
            message: "Something went wrong",
            data: {}
        })
    }
}

//Login via passcode

const userLogin = async (req, res) => {
    console.log("Login.................")
    try {
        if (!req.headers.authorization) {
            return console.log("Access Token not defined")
        }
        let token = req.headers.authorization.split(' ')[1];
        console.log(token)
        let decodeCode = await functions.authenticate(token)
        if (!decodeCode) {
            return console.log("Token is not correct")
        }

        token.accessToken = decodeCode.accessToken
        console.log("Hii")
        let find = await userAuth.findOne({ accessToken: token });
        console.log("Hii")
        if (find.mobileNo) {
            let payLoad = req.body;
            console.log(payLoad)
            let data = await user.findOne({ mobileNo: find.mobileNo });
            console.log(data)
            console.log("passcode: " + payLoad.passcode)
            if (!data) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "User not found",
                    data: {}
                })
            }
            let isPasswordValid = functions.validatePassword(data.salt, payLoad.passcode, data.passcode);
            console.log(isPasswordValid)
            if (!isPasswordValid) {
                return res.status(200).json({
                    statusCode: 400,
                    message: "invalid passcode",
                    data: { flag: 0 }
                })
            } else {
                let newData = { mobileNo: data.mobileNo, profilePic: data.profilePic, fullName: data.fullName, dob: data.dob, place: data.place, accessToken: find.accessToken }
                return res.status(200).json({
                    statusCode: 200,
                    message: "Success",
                    data: newData
                })
            }
        } else {

            return res.status(200).json({
                statusCode: 200,
                message: "Failure",
                data: {}
            })
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({
            statusCode: 400,
            message: "Something went wrong",
            data: {}
        })
    }
}

//Login via fb

const viaFbLogin = async (req, res) => {
    console.log("Login.................")
    try {
        let payLoad = req.body;
        console.log(payLoad)
        let data = await user.findOne({ mobileNo: payLoad.mobileNo });
        let emailData = await user.findOne({ email: payLoad.email });
        console.log(data)
        if (!data || !emailData) {
            if (payLoad.mobileNo) {
                let token = jwt.sign({ mobileNo: payLoad.mobileNo }, 's3cr3t');
                let userData = await user.create(payLoad);
                let createData = await userAuth.create({ mobileNo: payLoad.mobileNo, accessToken: token })
                let userInfo = await user.findOne({ mobileNo: payLoad.mobileNo });
                let newData = { id: userInfo._id, mobileNo: userInfo.mobileNo, profilePic: userInfo.profilePic, gender: userInfo.gender, fullName: userInfo.fullName, dob: userInfo.dob, place: userInfo.place, accessToken: createData.accessToken, passcode: userInfo.passcode }
                return res.status(200).json({
                    statusCode: 200,
                    message: "Success",
                    data: newData
                })
            } else if (payLoad.email) {
                let token = jwt.sign({ email: payLoad.email }, 's3cr3t');
                let userData = await user.create(payLoad);
                let createData = await userAuth.create({ email: payLoad.email, accessToken: token })
                let userInfo = await user.findOne({ email: payLoad.email });
                let newData = { id: userInfo._id, email: userInfo.email, profilePic: userInfo.profilePic, gender: userInfo.gender, fullName: userInfo.fullName, dob: userInfo.dob, place: userInfo.place, accessToken: createData.accessToken, passcode: userInfo.passcode }
                return res.status(200).json({
                    statusCode: 200,
                    message: "Success",
                    data: newData
                })
            }
        } else {
            if (payLoad.mobileNo) {
                let token = jwt.sign({ mobileNo: payLoad.mobileNo }, 's3cr3t');
                let createData = await userAuth.create({ mobileNo: payLoad.mobileNo, accessToken: token })
                let userInfo = await user.findOne({ mobileNo: payLoad.mobileNo });
                let newData = { id: userInfo._id, mobileNo: userInfo.mobileNo, profilePic: userInfo.profilePic, gender: userInfo.gender, fullName: userInfo.fullName, dob: userInfo.dob, place: userInfo.place, accessToken: createData.accessToken, passcode: userInfo.passcode }
                return res.status(200).json({
                    statusCode: 200,
                    message: "Success",
                    data: newData
                })
            } else if (payLoad.email) {
                let token = jwt.sign({ email: payLoad.email }, 's3cr3t');
                let createData = await userAuth.create({ email: payLoad.email, accessToken: token })
                let userInfo = await user.findOne({ email: payLoad.email });
                let newData = { id: userInfo._id, email: userInfo.email, profilePic: userInfo.profilePic, gender: userInfo.gender, fullName: userInfo.fullName, dob: userInfo.dob, place: userInfo.place, accessToken: createData.accessToken, passcode: userInfo.passcode }
                return res.status(200).json({
                    statusCode: 200,
                    message: "Success",
                    data: newData
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({
            statusCode: 400,
            message: "Failure",
            data: {}
        })
    }
}


//Update passcode

const updatePasscode = async (payLoad, token) => {
    console.log("Update passcode")
    try {
        let decodedData = await functions.authenticate(token);
        console.log(decodedData)
        if (!decodedData) {
            return res.status(200).json({
                statusCode: 400,
                message: "somthing went wrong1",
                data: {}
            })
        }
        let hashObj = functions.hashPassword(payLoad.passcode);
        console.log(hashObj)
        delete passcode;
        payLoad.salt = hashObj.salt;
        payLoad.passcode = hashObj.hash;
        console.log(payLoad.salt);
        console.log('----------')
        console.log(payLoad.passcode);
        console.log('----------')
        console.log("updatePasscode")
        let userInfo = await userAuth.findOne({ accessToken: token });
        user.findOne({ mobileNo: userInfo.mobileNo }, async (err, data) => {

            console.log('111000')
            let userData = await user.updateOne({
                mobileNo: userInfo.mobileNo
            },
                {
                    passcode: payLoad.passcode,
                    salt: payLoad.salt
                });
            return userData;
        })
    } catch (error) {
        console.error(error)
        throw error

    }

}

//login via access token:-

const loginTokenService = async (token) => {
    try {
        let decodedData = await functions.authenticate(token);
        console.log(decodedData)
        console.log("Hii")
        if (!decodedData) {
            return res.status(200).json({
                statusCode: 400,
                message: "somthing went wrong1",
                data: {}
            })
        }
        let userData = await userAuth.findOne({
            accessToken: token
        })
        if (!userData) {
            throw new Error("user not found");
        } else {
            let userInfo = await user.findOne({ mobileNo: userData.mobileNo });
            return userInfo
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

//Get user

const getUser = async (query, token) => {
    try {
        let find = await userAuth.findOne({ accessToken: token });
        console.log(token)
        let findData = await user.findOne({ mobileNo: find.mobileNo });

        let criteria = [];
        if (findData.mobileNo != undefined) {
            criteria.push({ $match: { mobileNo: findData.mobileNo } });
        }
        let userData = (await user.aggregate(criteria))[0];
        let videoData = await videoAndLike.aggregate(criteria);

        return { userData, videoData }

    } catch (error) {
        console.error(error)
        throw error;
    }
}


//Get  all user

const getAllUser = async (req, res) => {
    try {

        if (!req.headers.authorization) {
            return console.log("Access Token not defined")
        }
        let token = req.headers.authorization.split(' ')[1];
        console.log(token)
        let decodeCode = await functions.authenticate(token)
        if (!decodeCode) {
            return console.log("Something went wrong")
        }

        token.accessToken = decodeCode.accessToken
        console.log("Hii")
        let find = await adminAuth.findOne({ accessToken: token });
        console.log("Hii")
        //   if (find.email) {
        console.log("get all User")
        let userData = await user.find();

        console.log(userData)
        return userData;

    } catch (error) {
        console.error(error)
        throw error;
    }
}


//Delete all user

const deleteAllUser = async (req, res) => {
    console.log("Delete user")
    try {
        if (!req.headers.authorization) {
            return console.log("Access Token not defined")
        }
        let token = req.headers.authorization.split(' ')[1];
        console.log(token)
        let decodeCode = await functions.authenticate(token)
        if (!decodeCode) {
            return console.log("Something went wrong")
        }

        token.accessToken = decodeCode.accessToken
        console.log("Hii")
        let find = await adminAuth.findOne({ accessToken: token });
        console.log("Hii")
        if (find.email) {
            console.log("deleteUser")
            let userData = await user.remove();
            return userData;
        } else {
            return console.log("Something went wrong")
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}


//Delete User

const deleteUser = async (req, res, payLoad) => {
    console.log("Delete user")
    try {
        if (!req.headers.authorization) {
            return console.log("Access Token not defined")
        }
        let token = req.headers.authorization.split(' ')[1];
        console.log(token)
        let decodeCode = await functions.authenticate(token)
        if (!decodeCode) {
            return console.log("Something went wrong")
        }

        token.accessToken = decodeCode.accessToken
        console.log("Hii")
        let find = await adminAuth.findOne({ accessToken: token });
        //if (find.email) {
        console.log("deleteUser")
        let userData = await user.deleteOne({ _id: mongodb.ObjectID(payLoad.id) });
        let deleteCoinHistory = await coinHistory.deleteOne({ mobileNo: userData.mobileNo });
        let deleteVideo = await videoAndLike.deleteMany({ mobileNo: userData.mobileNo });
        let deleteFollower = await follower.deleteOne({ mobileNo: userData.mobileNo })

        return { userData, deleteCoinHistory, deleteVideo, deleteFollower };
        //} else {
        //  return console.log("Something went wrong")
        // }
    } catch (error) {
        console.error(error)
        throw error
    }
}


//Update profile

const updateProfile = async (payLoad, token) => {
    try {
        let find = await userAuth.findOne({ accessToken: token });

        let data = await user.updateOne({ mobileNo: find.mobileNo }, {
            $set: {
                //     profilePic: payLoad.profilePic,
                fullName: payLoad.fullName,
                dob: payLoad.dob
            }
        }, { new: true });
        //update videoLike model
        let updateVideoPic = await videoAndLike.updateMany({ mobileNo: find.mobileNo }, {
            $set: {
                //       profilePic: payLoad.profilePic,
                fullName: payLoad.fullName
            }
        }, { new: true });
        //update giftExchange model
        let updateGiftSender = await giftExchange.updateMany({ senderMobileNo: find.mobileNo }, {
            $set: {
                senderName: payLoad.fullName
            }
        }, { new: true });

        let updateGiftReceiver = await giftExchange.updateMany({ receiverMobileNo: find.mobileNo }, {
            $set: {
                receiverName: payLoad.fullName
            }
        }, { new: true });

        //update coinhistory model
        let updateCoinHistory = await coinHistory.updateOne({ mobileNo: find.mobileNo }, {
            $set: {
                fullName: payLoad.fullName
            }
        }, { new: true });

        //update followers
        //   let updateFollowerData=await follower.updateOne();

        let findData = await user.findOne({ mobileNo: find.mobileNo });
        //let updatedData = { mobileNo: find.mobileNo, profilePic: payLoad.profilePic };

        return { findData, updateVideoPic, updateGiftSender, updateGiftReceiver, updateCoinHistory }

        // return updatedData
    } catch (error) {
        throw error
    }
}

//update profile pic
const updateProfilePic = async (payLoad, token) => {
    try {
        let find = await userAuth.findOne({ accessToken: token });
        let data = await user.updateOne({ mobileNo: find.mobileNo }, {
            $set: {
                profilePic: payLoad.profilePic,
            }
        }, { new: true });
        //update videoLike model
        let updateVideoPic = await videoAndLike.updateMany({ mobileNo: find.mobileNo }, {
            $set: {
                profilePic: payLoad.profilePic,
            }
        }, { new: true });

        let findData = await user.findOne({ mobileNo: find.mobileNo });

        return findData

    } catch (error) {
        throw error
    }
}


//update cover pic

const updateCoverPic = async (payLoad, token) => {
    try {
        let find = await userAuth.findOne({ accessToken: token });
        let data = await user.updateOne({ mobileNo: find.mobileNo }, {
            $set: {
                coverPic: payLoad.coverPic
            }
        }, { new: true });
        //let updatedData = { mobileNo: find.mobileNo, coverPic: payLoad.coverPic };
        let findData = await user.findOne({ mobileNo: find.mobileNo });

        return findData
    } catch (error) {
        throw error
    }
}

//Delete video

const deleteVideo = async (req, res, payLoad) => {
    console.log("Delete video")
    try {
        if (!req.headers.authorization) {
            return console.log("Access Token not defined")
        }
        let token = req.headers.authorization.split(' ')[1];
        console.log(token)
        let decodeCode = await functions.authenticate(token)
        if (!decodeCode) {
            return console.log("Something went wrong")
        }

        token.accessToken = decodeCode.accessToken
        console.log("Hii")
        let find = await adminAuth.findOne({ accessToken: token });
        console.log("Hii")
        if (find.email) {
            console.log("deleteVideo")
            let userData = await user.updateOne({
                _id: mongodb.ObjectID(payLoad.id)
            }, {
                $pull: {
                    videos: payLoad.url
                }
            });
            return userData;
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}


//view other profile

const viewOtherProfile = async (query, token) => {
    try {
        let find = await userAuth.findOne({ accessToken: token });

        let findFollowing = await follower.findOne({
            mobileNo: find.mobileNo,
            followingMobileNo: {
                $elemMatch: {
                    mobileNo: query.mobileNo
                }
            }
        })
        if (!findFollowing) {
            let criteria1 = [];
            if (!query.mobileNo != undefined) {
                criteria1.push({ $match: { mobileNo: query.mobileNo } });
            }
            let userData = (await user.aggregate(criteria1))[0];
            let videoData = await videoAndLike.aggregate(criteria1);

            if (query.limit != undefined) {
                criteria1.push({ $limit: query.limit })
            }

            if (query.skip != undefined) {
                criteria1.push({ $skip: query.skip })
            }

            return { userData, videoData, isFollow: 1 }

        } else {
            let criteria = [];
            if (!query.mobileNo != undefined) {
                criteria.push({ $match: { mobileNo: query.mobileNo } });
            }
            let userData = (await user.aggregate(criteria))[0];
            let videoData = await videoAndLike.aggregate(criteria);

            if (query.limit != undefined) {
                criteria.push({ $limit: query.limit })
            }

            if (query.skip != undefined) {
                criteria.push({ $skip: query.skip })
            }

            return { userData, videoData, isFollow: 0 }

        }
    } catch (error) {
        throw error;
    }
}

//Followers

const followersServices = async (payload, token) => {
    try {
        //current user
        let authData = await userAuth.findOne({ accessToken: token });

        let find = await user.findOne({ mobileNo: authData.mobileNo });
        //following user
        let findData = await user.findOne({ mobileNo: payload.mobileNo });

        let findFollowing = await follower.findOne({
            mobileNo: find.mobileNo,
            followingMobileNo: {
                $elemMatch: {
                    mobileNo: payload.mobileNo
                }
            }
        })
        if (!findFollowing) {
            // if()
            //following user follower update
            var followerData = await user.updateOne({
                mobileNo: payload.mobileNo
            },
                {
                    $inc: { followers: 1 }
                }
            );
            //current user following update
            var followingData = await user.updateOne({
                mobileNo: authData.mobileNo
            },
                {
                    $inc: { following: 1 }
                }
            );

            //followers

            let followers = {
                mobileNo: payload.mobileNo,
                followerMobileNo: {
                    mobileNo: find.mobileNo,
                    fullName: find.fullName,
                    profilePic: find.profilePic,
                    //isFollow:"1"
                }
            }
            //followers &  following
            let updateFollowerData = await follower.updateOne({
                mobileNo: payload.mobileNo
            }, {
                $push: {
                    followerMobileNo: {
                        mobileNo: followers.followerMobileNo.mobileNo,
                        fullName: followers.followerMobileNo.fullName,
                        profilePic: followers.followerMobileNo.profilePic,
                        //          isFollow: "1"
                    }
                }
            },
                { new: true });

            let following = {
                mobileNo: authData.mobileNo,
                followingMobileNo: {
                    mobileNo: findData.mobileNo,
                    fullName: findData.fullName,
                    profilePic: findData.profilePic
                }
            }
            let updateFollowingData = await follower.updateOne({
                mobileNo: authData.mobileNo
            },
                {
                    $push: {
                        followingMobileNo: {
                            mobileNo: following.followingMobileNo.mobileNo,
                            fullName: following.followingMobileNo.fullName,
                            profilePic: following.followingMobileNo.profilePic,
                            //            isFollow: "1"
                        }
                    }
                },
                { new: true });

            //video following
            let updatevideoFollowing = await videoAndLike.updateMany({
                mobileNo: find.mobileNo
            },
                {
                    $push: {
                        followingMobileNo: {
                            mobileNo: following.followingMobileNo.mobileNo,
                        }
                    }
                })

            //return { followerData, followingData, updateFollowerData, updateFollowingData}
            return { isFollow: 1 }

        }
        else {
            // throw new Error ("already following");
            return { isFollow: 0 }
        }

    } catch (error) {
        throw error
    }
}

//get user follower following

const getFollowers = async (token) => {
    try {

        let authData = await userAuth.findOne({ accessToken: token });

        //  let find = await user.findOne({ mobileNo: authData.mobileNo });
        console.log(authData.mobileNo);
        let data = await follower.findOne({ mobileNo: authData.mobileNo });

        return data;
    } catch (error) {
        throw error;
    }
}

//get all follower following[test]

const getAllFollowers = async () => {
    try {
        let data = await follower.find();

        return data;
    } catch (error) {
        throw error;
    }
}

//Send email
const sendMail = async (payLoad) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'venus.bityotta@gmail.com',
                pass: 'venus@123'
            }
        });

        const mailOptions = {
            from: 'venus.bityotta@gmail.com',
            to: 'sandip@vivanpharma.com',
            subject: payLoad.subject,
            text: "Hi, " + "\n" + "Client name-: " + payLoad.name + '\n' + "Email-: " + payLoad.email + "\n" + "Message-:" + payLoad.message
        };

        let sendMail = await transporter.sendMail(mailOptions);

        return sendMail;

    } catch (error) {
        console.error(error)
        throw error;
    }
}


//search

const search = async (query) => {
    try {

        let data = await user.find({
            fullName: { $regex: new RegExp(query.fullName) }
        }).limit(10)


        if (data.length < 1) {
            return "No person found, please try again."
        }


        return data;
    } catch (error) {
        throw error;
    }
}



module.exports = {
    userVerify, verifyOTPServices, userSignup, getAllUser, verifyPasscodeServices, getUser, userLogin,
    loginTokenService, deleteAllUser, viaFbLogin, updatePasscode, deleteUser, updateProfile, updateProfilePic,
    updateCoverPic, deleteVideo, viewOtherProfile, followersServices, getFollowers, getAllFollowers, sendMail, search,
}