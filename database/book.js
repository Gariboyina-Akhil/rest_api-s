const mongoose = require("mongoose");

//schema
const BookSchema = mongoose.Schema({
    ISBN : String,
    name : String,
    Authors: [Number],
    language: String,
    pubDate : String,
    noOfPages : Number,
    category:[String],
    publications : Number
});

//model
const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel ;