const {Schema, model} = require("mongoose")

const Token = new Schema({
    token: {type: String, unique: true, required: true}
})

module.exports = model("Token", Token)