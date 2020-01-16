const mongoose = require('mongoose')
const Schema = mongoose.Schema

let adminSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    salt: String,
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('adminSchema', adminSchema)