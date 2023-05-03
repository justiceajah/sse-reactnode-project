const mongoose = require("mongoose");
const config = require("../config");
const { mongodbUrl } = config;

const connect = async () => {
  try {
    await mongoose.connect(mongodbUrl);
    console.log("Mongo db is connected");
  } catch (error) {
    console.log("Error is: ",error.message);
  }
};


module.exports = connect;