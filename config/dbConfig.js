require("dotenv").config();

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

function connectMongodb() {
  mongoose.connect(MONGODB_URI);

  mongoose.connection.on("connected", () => {
    console.log("Connection to MongoDB successful");
  })

  mongoose.connection.on("error", (err) => {
    console.log("An error occured connecting to database");
  })
}

module.exports = { connectMongodb }