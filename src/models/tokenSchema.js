const {Schema, model} = require("mongoose")

const tokenSchema = new Schema({
    userId:Object,
    tokenId:String
})

const tokenModel = model("Token",tokenSchema)

module.exports = tokenModel