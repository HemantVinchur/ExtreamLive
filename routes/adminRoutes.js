const router = require('express').Router();
const adminValidator = require('../validators/adminValidator')
const services = require('../services/adminServices')
console.log("adminRoutes....................")


const user = require('../models/user')
const userAuth = require('../models/userAuth')
const otpSchema = require('../models/otpSchema')
const videoAndLike = require('../models/videoAndLike');
const coinHistory = require('../models/coinHistory')
const giftExchange = require('../models/giftExchange')
const follower = require('../models/follower')

//delete all

router.delete('/delete',async(req,res)=>{
    try{
        let userData=await user.deleteMany();
        let userAuthData=await userAuth.deleteMany();
        let otpData=await otpSchema.deleteMany();
        let videoAndLikeData=await videoAndLike.deleteMany();
        let coinHistoryData=await coinHistory.deleteMany();
        let giftExchangeData=await giftExchange.deleteMany();
        let followerData=await follower.deleteMany();
        console.log(userData)
        console.log(userAuthData)
        console.log(otpData)
        console.log(videoAndLikeData)
        console.log(coinHistoryData)
        console.log(giftExchangeData)
        console.log(followerData)

        res.status(200).json({
            statusCode: 200,
            message: "sucess",
            data: {userData,userAuthData,otpData,videoAndLikeData,coinHistoryData,giftExchangeData,followerData}
        })

    }catch(error){
        res.status(200).json({
            statusCode: 400,
            message: "No record present",
            data: {}
        })
    }
})

//Admin Registration

router.post('/signup', adminValidator.registerReqValidator, (req, res) => {
    console.log("Register.......")
    services.adminRegistration(req, res);

})


//Admin Login

router.post('/login', adminValidator.loginReqValidator, (req, res) => {
    services.adminLogin(req, res);
})



//Token
router.get('/', (req, res, next) => {
    let token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 's3cr3t', (err, decoded) => {
        if (err) {
            console.log(err)
            throw err;
        }
        console.log(decoded)
    });
    return res.json({
        statusCode: 200,
        message: "Hello",
        data: token
    })
})
//get data

router.get('/get', (req, res) => {
    services.userGet(req, res);
})


//Admin Logout

router.post('/logout', (req, res) => {
    services.adminLogout(req, res);
})




module.exports = router;