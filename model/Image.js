const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    userid: String,
}, { timestamps: true })

const imageSchema = new mongoose.Schema({
    userid: String,
    image: String,
    likes: [ likeSchema ]
}, { timestamps: new Date() })

module.exports= mongoose.model("images", imageSchema)   