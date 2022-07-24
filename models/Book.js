const {Schema, model} = require("mongoose")

const Book = new Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    genre: {type: String, required: true},
    description: {type: String, required: true},
})

module.exports = model("Book", Book)