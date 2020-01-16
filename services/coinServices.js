const coinHistory = require('../models/coinHistory')
const user = require('../models/user')
const gift = require('../models/gift')
const redeem = require('../models/redeem')
const giftExchange = require('../models/giftExchange')
const follower = require('../models/follower')
const functions = require('../function')
const adminAuth = require('../models/adminAuth')
const setCoin = require('../models/setCoin');
const userAuth = require('../models/userAuth')
const mongoose = require('mongoose');

const setCoinServices = async (payLoad) => {
    try {
        let userData = await setCoin.create(payLoad);
        return userData
    } catch (error) {
        console.error(error)
        throw error;
    }
}

const getAllCoins = async () => {
    try {
        let data = await setCoin.find();
        return data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

//purchase coin
const purchaseCoin = async (payload, token) => {
    try {
        let authData = await userAuth.findOne({ accessToken: token });
        let find = await user.findOne({ mobileNo: authData.mobileNo });
        let findCoin = await setCoin.findOne({ _id: mongoose.Types.ObjectId(payload._id) })

        let newData = {
            mobileNo: find.mobileNo,
            fullName: find.fullName,
            balance: findCoin.coinPrice,
            totalCoins: findCoin.numberOfCoin,
            coins: {
                coinId: findCoin._id,
                coinPrice: findCoin.coinPrice,
                numberOfCoin: findCoin.numberOfCoin,
                coinImage: findCoin.coinImage,
                coinDetails: findCoin.coinDetails
            }
        }

        let findHistory = await coinHistory.findOne({ mobileNo: find.mobileNo });

        if (!findHistory) {
            let data = await coinHistory.create(newData);

            let updateUser = await user.updateOne({ mobileNo: find.mobileNo },
                {
                    $set: {
                        balance: findCoin.coinPrice,
                        totalCoins: findCoin.numberOfCoin
                    }
                }, { new: true })

            return data;
        }
        else {
            let amount = parseInt(findHistory.balance) + parseInt(findCoin.coinPrice);
            console.log(amount);
            let newCoins = parseInt(findHistory.totalCoins) + parseInt(findCoin.numberOfCoin);
            console.log(newCoins);

            let updateUsers = await user.updateOne({ mobileNo: find.mobileNo },
                {
                    $set: {
                        balance: amount,
                        totalCoins: newCoins
                    }
                }, { new: true })


            let updateBalance = await coinHistory.updateOne({ mobileNo: find.mobileNo },
                {
                    $set: {
                        balance: amount,
                        totalCoins: newCoins
                    },
                    $push: {
                        coins: {
                            coinId: newData.coins.coinId,
                            coinPrice: newData.coins.coinPrice,
                            numberOfCoin: newData.coins.numberOfCoin,
                            coinImage: newData.coins.coinImage,
                            coinDetails: newData.coins.coinDetails
                        }
                    }
                }, { new: true });

            let updatedData = await coinHistory.findOne({ mobileNo: find.mobileNo });
            return { updatedData }
        }

    } catch (error) {
        throw error
    }
}

//delete coin

const deleteCoin = async (payLoad) => {
    try {
        let userData = await setCoin.deleteOne({ _id: mongoose.Types.ObjectId(payLoad._id) });

        return userData;
    } catch (error) {
        console.error(error)
        throw error
    }
}

//get all coin
const getAllCoinHistory = async (token) => {
    try {
        let coinExchangeData = await coinHistory.find();
        return coinExchangeData;

    } catch (error) {
        console.error(error)
        throw error;
    }
}


//---------gifts------------------

//Create gift

const userGift = async (payLoad) => {
    try {
        let userData = await gift.create(payLoad);
        return userData
    } catch (error) {
        console.error(error)
        throw error;
    }
}

//get all gifts
const getAllGift = async () => {
    try {
        let giftExchangeData = await gift.find();
        return giftExchangeData;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

//update gift

const updateGift = async (payLoad) => {
    try {

        let data = await gift.updateOne({ _id: mongoose.Types.ObjectId(payLoad._id) },
            {
                $set: {
                    image: payLoad.image,
                    image_details: payLoad.image_details,
                    image_price: payLoad.image_price,
                }
            }, { new: true });

        return data;
    } catch (error) {
        console.error(error)
        throw error
    }

}

//delete gift
const deleteGift = async (payload) => {
    try {
        let userData = await gift.deleteOne({ _id: mongoose.Types.ObjectId(payload._id) });
        return userData;
    } catch (error) {
        console.error(error)
        throw error
    }
}

const userGiftExchange = async (payload, token) => {
    try {
        //sending gift user
        let findAuth = await userAuth.findOne({ accessToken: token });
        let findSender = await user.findOne({ mobileNo: findAuth.mobileNo });
        let senderCoin = findSender.totalCoins

        //receiving gift user
        let findReceiver = await user.findOne({ mobileNo: payload.mobileNo });
        //find gift
        let findGift = await gift.findOne({
            _id: mongoose.Types.ObjectId(payload._id)
        });
        let giftCoin = findGift.image_price;


        if (senderCoin >= giftCoin) {
            console.log("1");
            let sendCoins = Number(findSender.totalCoins) - Number(findGift.image_price);
            console.log(sendCoins)
            let receiveCoins = parseInt(findReceiver.totalCoins) + parseInt(findGift.image_price);
            console.log(receiveCoins)

            let newData = {
                giftId: payload._id,
                image: findGift.image,
                image_details: findGift.image_details,
                image_price: findGift.image_price,

                senderMobileNo: findSender.mobileNo,
                senderName: findSender.fullName,
                senderTotalCoin: sendCoins,

                receiverMobileNo: findReceiver.mobileNo,
                receiverName: findReceiver.fullName,
                receiverTotalCoin: receiveCoins,
            }
            console.log(newData)
            let createData = await giftExchange.create(newData);

            let senderCoinHistory = await coinHistory.updateOne({ mobileNo: findSender.mobileNo },
                {
                    $set: {
                       // balance: sendCoins,
                        totalCoins: sendCoins,
                    }
                }, { new: true });
            let senderUserBalance = await user.updateOne({ mobileNo: findSender.mobileNo },
                {
                    $set: {
                       // balance: sendCoins,
                        totalCoins:sendCoins,
                    }
                }, { new: true });

            let findHistory = await coinHistory.findOne({ mobileNo: payload.mobileNo });
            let receiverUserBalance = await user.updateOne({ mobileNo: payload.mobileNo },
                {
                    $set: {
                       // balance: sendCoins,
                        totalCoins: receiveCoins,
                    }
                }, { new: true });

            if (findHistory) {
                console.log("2")
                let receiverCoinHistory = await coinHistory.updateOne({ mobileNo: payload.mobileNo },
                    {
                        $set: {
                         //   balance: sendCoins,
                            totalCoins: receiveCoins,
                        }
                    }, { new: true });

                return {createData,flag: 1}

            } else {
                let createCoinHistory = await coinHistory.create({
                    mobileNo: payload.mobileNo,
                    fullName: findReceiver.fullName,
                    //  balance: ,
                    totalCoins: receiveCoins,
                    coins: {}
                })
                return {createData, flag: 1}
            }
        } else {
            let createData = await giftExchange.findOne({senderMobileNo:findSender.mobileNo});
            return { createData,flag: 0 }
        }
    } catch (error) {
        throw error;
    }
}


//receive gifts[user]

const receiveGifts=async(token)=>{
    try{
        let authData=await userAuth.findOne({accessToken:token});

        let find =await giftExchange.find({receiverMobileNo:authData.mobileNo});

        return find;

    }catch(error){
        throw error;
    }

}


//all send and receive gifts
const getAllGifts = async (token) => {
    try {
        console.log("1111111")
        let giftData = await giftExchange.find();
        return giftData;

    } catch (error) {
        console.error(error)
        throw error;
    }
}

module.exports = {
    setCoinServices, getAllCoins, purchaseCoin, deleteCoin,getAllCoinHistory ,userGift, getAllGift, updateGift,
    deleteGift,userGiftExchange,receiveGifts,getAllGifts
}