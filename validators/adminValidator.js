const { Joi, celebrate } = require('celebrate')

const registerReqValidator = celebrate({
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
})


const loginReqValidator = celebrate({
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
})


module.exports = { registerReqValidator, loginReqValidator }