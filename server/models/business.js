let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

//create a model class
let businessModel = mongoose.Schema(
  {
    name: String,
    number: Number,
    email: String,
  },
  {
    collection: "business",
  }
);

module.exports = mongoose.model("Business", businessModel);