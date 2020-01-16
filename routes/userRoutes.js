const router = require('express').Router();
const jwt = require('jsonwebtoken')
const userValidator = require('../validators/userValidator')
const functions = require('../function')
const user = require('../models/user')
const userAuth = require('../models/userAuth')
const otpSchema = require('../models/otpSchema')
const services = require('../services/userServices')
console.log("userRoutes....................")

//Verify

router.post('/verify', userValidator.verifyValidator,
    async (req, res) => {
        try {
            let payLoad = req.body;
            let findData = await services.userVerify(payLoad);
            return res.status(200).json({
                statusCode: 200,
                message: "Mail successfully send",
                data: findData
            })
        }
        catch (error) {
            console.log(error);
            res.status(200).json({
                statusCode: 400,
                message: "Failure",
                data: {}
            })
        }
    })

//Verify OTP
router.post('/verifyOTP', userValidator.verifyOTPValidator,
    async (req, res) => {
        try {
            let payLoad = req.body;
            let adminUser = await services.verifyOTPServices(req, res, payLoad);
        }
        catch (error) {
            console.log(error);

        }
    })

//Verify Passcode
router.post('/verifyPasscode', userValidator.verifyOTPValidator,
    async (req, res) => {
        try {
            let payLoad = req.body;
            let adminUser = await services.verifyPasscodeServices(res, payLoad);
            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: adminUser
            })
        }
        catch (error) {
            console.log(error);
            res.status(200).json({
                statusCode: 401,
                message: "Failure",
                data: {}
            })
        }
    })

//User Registration

router.post('/signup',// userValidator.signupValidator, 
    (req, res) => {
        console.log("Register.......")
        services.userSignup(req, res);

    })

//Reset passcode
router.post('/resetPasscode', userValidator.resetPasswordValidator, async (req, res) => {
    try {
        let payload = req.body;
        if (payload.newPasscode === payload.confirmPasscode) {
            let hashObj = functions.hashPassword(payload.newPasscode);
            console.log(hashObj)
            delete passcode;
            payload.salt = hashObj.salt;
            payload.newPasscode = hashObj.hash;
            console.log(payload.salt);
            console.log('----------')
            console.log(payload.newPasscode);
            console.log('----------')
            let updateData = await user.updateOne({ mobileNo: payload.mobileNo },
                {
                    $set: {
                        passcode: payload.newPasscode,
                        salt: payload.salt
                    }
                },
                { new: true });
            return res.status(200).json({
                statusCode: 200,
                message: "sucess",
                data: { updateData }
            })
        }
        else {
            return res.status(200).json({
                statusCode: 400,
                message: "new password and confirm password is not equal",
                data: {}
            })
        }
    }
    catch (error) {
        console.log(error);
        res.status(200).json({
            statusCode: 400,
            message: "Failure",
            data: {}
        })
    }
})

//Login via passcode

router.post('/login', userValidator.loginReqValidator, (req, res) => {
    services.userLogin(req, res);
})

//User Login via fb

router.post('/loginFb', userValidator.fbValidator, (req, res) => {
    services.viaFbLogin(req, res);
})

//Update passcode

router.put('/updatePasscode',
    async (req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token);
            console.log("Passcode update API")
            let payLoad = req.body;
            let userData = await services.updatePasscode(payLoad, token);
            return res.status(200).json({
                statusCode: 200,
                message: "Passcode successfully updated",
                data: userData
            })

        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "Passcode does not updated",
                data: {}
            })
        }
    })

//Login via accesstoken
router.post('/loginToken',
    async (req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 101,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token);

            let data = await services.loginTokenService(token);

            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: data
            })

        } catch (error) {
            return res.status(200).json({
                statusCode: 400,
                message: "Failure",
                data: {}
            })
        }
    })
//-----------on board completed-----------


//Get user [user]
router.get('/getUser',
    async (req, res) => {
        try {
            let query = req.query;
            console.log("Get user API");
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 240,
                    message: "access token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token);

            let userData = await services.getUser(query, token);
            return res.status(200).json({
                statusCode: 200,
                message: "User successfully fetched!!!!",
                data: userData
            })


        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "somthing went wrong",
                data: {}
            })
        }
    })

    
//Get All Users[admin]

router.get('/getAllUser',
    async (req, res) => {
        try {
            console.log("Get all user API");
            let userData = await services.getAllUser(req, res);
            return res.status(200).json({
                statusCode: 200,
                message: "User successfully fetched!!!!",
                data: userData
            })
        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "No record present",
                data: {}
            })
        }
    })


//Delete user[admin]

router.delete('/deleteUser',
    async (req, res) => {
        try {
            console.log("User delete API")
            let payLoad = req.body;
            console.log(payLoad)
            let userData = await services.deleteUser(req, res, payLoad);
            return res.status(200).json({
                statusCode: 200,
                message: "User successfully deleted!!!!",
                data: userData
            })

        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "User does not deleted",
                data: {}
            })
        }
    })

//Delete all user

router.delete('/deleteAll',
    async (req, res) => {
        try {
            console.log("Delete all user")
            let userData = await services.deleteAllUser(req, res);
            return res.status(200).json({
                statusCode: 200,
                message: "All users successfully deleted",
                data: userData
            })

        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "Users not deleted",
                data: {}
            })


        }
    })

//Update profilePic

router.put('/updateProfile',
    async (req, res) => {
        try {
            let payLoad = req.body;
            let file = req.files;
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 240,
                    message: "access token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token);

            let data = await services.updateProfile(payLoad, token);
            return res.status(200).json({
                statusCode: 200,
                message: "Profile successfully updated",
                data: { data }
            })

        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 400,
                message: "Somthing went wrong",
                data: {}
            })
        }
    })

//update profile pic

router.put('/updateProfilePic',
    async (req, res) => {
        try {
            let payLoad = req.body;
            let file = req.files;
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 240,
                    message: "access token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token);

            let data = await services.updateProfilePic(payLoad,token);
            return res.status(200).json({
                statusCode: 200,
                message: "Profile successfully updated",
                data: { data }
            })

        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 400,
                message: "Somthing went wrong",
                data: {}
            })
        }
    })

//update cover pic

router.put('/updateCoverPic',
    async (req, res) => {
        try {
            let payLoad = req.body;
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 240,
                    message: "access token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token);

            let userData = await services.updateCoverPic(payLoad, token);
            return res.status(200).json({
                statusCode: 200,
                message: "Profile pic successfully updated!!!!",
                data: userData
            })
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 400,
                message: "Somthing went wrong",
                data: {}
            })
        }
    })


//view other user profile

router.get('/viewOtherProfile', async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(200).json({
                statusCode: 401,
                message: "Access Token not found",
                data: {}
            })
        }
        let token = req.headers.authorization.split(' ')[1];
        console.log(token);

        let query = req.query;
        let data = await services.viewOtherProfile(query, token);

        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: data
        })

    } catch (error) {
        console.log(error);
        res.status(200).json({
            statusCode: 400,
            message: "Somthing went wrong",
            data: {}
        })
    }
})

//add Followers
router.put('/followers',
    //userValidator.followersValidator,
    async (req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token);
            let payload = req.body;
            let adminData = await services.followersServices(payload, token);

            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: adminData
            })
        }
        catch (error) {
            console.log(error);
            res.status(200).json({
                statusCode: 400,
                message: "Somthing went wrong",
                data: {}
            })
        }
    })

//get particular person  followers and following

router.get('/getFollower', async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(200).json({
                statusCode: 401,
                message: "Access Token not found",
                data: {}
            })
        }
        let token = req.headers.authorization.split(' ')[1];
        console.log(token);
        let data = await services.getFollowers(token);

        return res.status(200).json({
            statusCode: 200,
            message: "Sucess",
            data: data
        })

    } catch (error) {
        console.log(error);
        res.status(200).json({
            statusCode: 400,
            message: "Somthing went wrong",
            data: {}
        })
    }
})



//get all followers and following

router.get('/getAllFollower', async (req, res) => {
    try {
        let data = await services.getAllFollowers();

        return res.status(200).json({
            statusCode: 200,
            message: "Sucess",
            data: data
        })

    } catch (error) {
        console.log(error);
        res.status(200).json({
            statusCode: 400,
            message: "Somthing went wrong",
            data: {}
        })
    }
})


//Send email(this is for another project)

router.post('/email', userValidator.emailValidator,
    async (req, res) => {
        try {
            let payLoad = req.body;
            let userData = await services.sendMail(payLoad);
            return res.status(200).json({
                statusCode: 200,
                message: "Mail successfully send",
                data: userData
            })

        } catch (error) {
            res.status(200).json({

                statusCode: 400,
                message: "Mail does not send",
                data: {}
            })
        }
    })


//search users

router.get('/search', async (req, res) => {
    try {
        let query = req.query;
        let data = await services.search(query);

        return res.status(200).json({
            statusCode: 200,
            message: "sucess",
            data: { data }
        })
    } catch (error) {
        console.log(error);
        res.status(200).json({
            statusCode: 400,
            message: "somthing went wrong",
            data: {}
        })
    }
})


module.exports = router;