const { celebrate, Joi } = require('celebrate');

const signupValidator = celebrate({
    body: Joi.object().keys({
        mobileNo: Joi.number().required(),
        profilePic: Joi.string().optional(),
        gender: Joi.string().optional(),
        fullName: Joi.string().required(),
        dob: Joi.string().required(),
        place: Joi.string().optional(),
        passcode: Joi.string().regex(/^[0-9]{4}$/).required(),
    })
})

const verifyValidator = celebrate({
    body: Joi.object().keys({
        email: Joi.string().required(),
        mobileNo: Joi.number().required(),
    })
})

const verifyOTPValidator = celebrate({
    body: Joi.object().keys({
        mobileNo: Joi.number().required(),
        otp: Joi.number().required(),
    })
})

const loginReqValidator = celebrate({
    body: Joi.object().keys({
        passcode: Joi.string().regex(/^[0-9]{4}$/).required()
    })
})

const imageUploadValidator = celebrate({
    body: Joi.object().keys({
        mobileNo: Joi.number().required(),
        url: Joi.string().required()
    })
})

const bannerUploadValidator = celebrate({
    body: Joi.object().keys({
        url: Joi.string().required()
    })
})

const resetPasswordValidator = celebrate({
    body: Joi.object().keys({
        mobileNo: Joi.number().required(),
        newPasscode: Joi.string().regex(/^[0-9]{4}$/).required(),
        confirmPasscode: Joi.string().regex(/^[0-9]{4}$/).required(),
    })
})

const fbValidator = celebrate({
    body: Joi.object().keys({
        email: Joi.string().email().optional(),
        mobileNo: Joi.number().optional(),
        profilePic: Joi.string().optional(),
        gender: Joi.string().optional(),
        fullName: Joi.string().optional(),
        dob: Joi.string().regex(/^([1-9]|[12][0-9]|3[01])[-/.]([1-9]|1[012])[-/.](19|20)\d\d$/).optional(),
        place: Joi.string().optional(),
        passcode: Joi.string().optional()
    })
})

const coinValidator = celebrate({
    body: Joi.object().keys({
        mobileNo: Joi.number().required(),
        amount: Joi.string().required()
    })
})

const redeemValidator = celebrate({
    body: Joi.object().keys({
        mobileNo: Joi.number().required(),
        // gift: Joi.string().optional(),
        gift: Joi.array().items(Joi.string().min(0).optional())
    })
})

const giftValidator = celebrate({
    body: Joi.object().keys({
        image: Joi.string().required(),
        image_details: Joi.string().required(),
        image_price: Joi.number().required()
    })
})

const giftExchangeValidator = celebrate({
    body: Joi.object().keys({
        senderMobileNo: Joi.number().required(),
        receiverMobileNo: Joi.number().required(),
        image: Joi.string().required()
    })
})

const setCoinValidator = celebrate({
    body: Joi.object().keys({
        price: Joi.number().required(),
        coins: Joi.number().required(),
        image: Joi.string().required()
    })
})

const followersValidator = celebrate({
    body: Joi.object().keys({
        mobileNo: Joi.number().required()
    })
})


const emailValidator = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        subject: Joi.string().required(),
        message: Joi.string().required()
    })
})

module.exports = { signupValidator, verifyValidator, verifyOTPValidator, loginReqValidator, imageUploadValidator, resetPasswordValidator, bannerUploadValidator, fbValidator, coinValidator, giftValidator, giftExchangeValidator, redeemValidator, followersValidator, setCoinValidator, emailValidator }