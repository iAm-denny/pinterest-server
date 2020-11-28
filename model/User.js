const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
   email:String,
   name:String,
   profileImage:String
},{ timestamps: true})

module.exports = mongoose.model('user', userSchema)