const router = require('express').Router();
const jwt = require('jsonwebtoken')
const validator = require('../validators/userValidator')
const services = require('../services/coinServices')

//add coins [admin]
router.post('/setCoin', //validator.setCoinValidator,
    async (req, res) => {
        try { 
            let payLoad = req.body;
            let userData = await services.setCoinServices(payLoad);
            return res.status(200).json({
                statusCode: 200,
                message: "Coin successfully set!!!",
                data: userData
            })

        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "Coin does not set",
                data: {}
            })
        }
    })

//get all coins[user/admin]
router.get('/getAllCoins',
    async (req, res) => {
        try {
            if (!req.headers.authorization) {
                return console.log("Access Token not defined")
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token)
            let coinsData = await services.getAllCoins();
            return res.status(200).json({
                statusCode: 200,
                message: "coins successfully fetched!!!!",
                data: {coinsData}
            })

        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "No record present",
                data: {}
            })
        }
    })

//purchase coin
router.post('/purchaseCoin', async (req, res) => {
    try {
        let payload=req.body;
        if(!req.headers.authorization){
            res.status(200).json({
                statusCode: 400,
                message: "Access token is not found",
                data:{}
            })
        }

        let token=req.headers.authorization.split(' ')[1];
        let data=await services.purchaseCoin(payload,token);

        return res.status(200).json({
            statusCode: 200,
            message: "sucess",
            data:data
        })
    }catch(error){
        console.log(error);
        res.status(200).json({
            statusCode: 400,
            message: "Somthing went wrong",
            data: {}
        })
    }
})

//delete coin
router.put('/deleteCoin',
    async (req, res) => {
        try {
            let payLoad = req.body;
            let userData = await services.deleteCoin(payLoad);

            return res.status(200).json({
                statusCode: 200,
                message: "Gift successfully updated!!!!",
                data: userData
            })

        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "Gift does not update",
                data: {}
            })
        }
    })


    //get all purchase coin
    router.get('/getAllCoinHistory',
    async (req, res) => {
        try {
            if(!req.headers.authorization){
                res.status(200).json({
                    statusCode: 400,
                    message: "Access token is not found",
                    data:{}
                })
            }
    
            let token=req.headers.authorization.split(' ')[1];
            
            let userData = await services.getAllCoinHistory(token);
            return res.status(200).json({
                statusCode: 200,
                message: "Set coins successfully fetched!!!!",
                data: userData
            })

        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "Gifts does not fetch",
                data: {}
            })
        }
    })



//------------------gifts----------

//add gifts
router.post('/gift',
    async (req, res) => {
        try {
            let payLoad = req.body;
            let userData = await services.userGift(payLoad);
            return res.status(200).json({
                statusCode: 200,
                message: "Gift successfully created!!!!",
                data: userData
            })

        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "Gift does not created",
                data: {}
            })
        }
    })

//get all gifts

router.get('/getAllGift',
    async (req, res) => {
        try {
            if(!req.headers.authorization){
                res.status(200).json({
                    statusCode: 400,
                    message: "Access token is not found",
                    data:{}
                })
            }
    
            let token=req.headers.authorization.split(' ')[1];
            
            let userData = await services.getAllGift();
            return res.status(200).json({
                statusCode: 200,
                message: "Set gifts successfully fetched!!!!",
                data: userData
            })

        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "Gifts does not fetch",
                data: {}
            })
        }
    })

//update gifts
router.put('/updateGift',
    async (req, res) => {
        try {
            let payLoad = req.body;
            let userData = await services.updateGift(payLoad);
            return res.status(200).json({
                statusCode: 200,
                message: "Gift successfully updated!!!!",
                data: userData
            })

        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "Gift does not update",
                data: {}
            })
        }
    })

//delete gift
router.put('/deleteGift',
    async (req, res) => {
        try {
            let payload = req.body;
            let userData = await services.deleteGift(payload);
            return res.status(200).json({
                statusCode: 200,
                message: "Gift successfully deleted!!!!",
                data: userData
            })

        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "Gift does not delete",
                data: {}
            })
        }
    })


router.post('/giftExchange',async(req,res)=>{
    try{
        let payload=req.body;
        if(!req.headers.authorization){
            res.status(200).json({
                statusCode: 400,
                message: "Access token is not found",
                data: {}
            })
        }
        let token=req.headers.authorization.split(' ')[1];
        console.log(token);
        let data=await services.userGiftExchange(payload,token);
        return res.status(200).json({
            statusCode: 200,
            message: "sucess",
            data:data
        })
    }catch(error){
        console.log(error);
        res.status(200).json({
            statusCode: 400,
            message: "Gift does not update",
            data: {}
        })
    }
})

//Fetch receive gifts

router.get('/receiveGifts',
    async (req, res) => {
        try {
            if (!req.headers.authorization) {
                return console.log("Access Token not defined")
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token)
            console.log("Receive gifts get API")
            let userData = await services.receiveGifts(token);
            return res.status(200).json({
                statusCode: 200,
                message: "Receive gifts successfully fetched!!!!",
                data: {userData}
            })

        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "No record is present",
                data: {}
            })
        }
    })
//get all gifts
    router.get('/getAllExchangeGifts',
    async (req, res) => {
        try {
            if(!req.headers.authorization){
                res.status(200).json({
                    statusCode: 400,
                    message: "Access token is not found",
                    data:{}
                })
            }
    
            let token=req.headers.authorization.split(' ')[1];
            
            let userData = await services.getAllGifts(token);
            return res.status(200).json({
                statusCode: 200,
                message: "Set coins successfully fetched!!!!",
                data: userData
            })

        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 400,
                message: "Gifts does not fetch",
                data: {}
            })
        }
    })


module.exports = router;