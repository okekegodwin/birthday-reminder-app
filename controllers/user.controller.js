const User = require("../models/user.model");

async function addUser(req, res) {
  try {
    const {username, email, dob} = req.body;

    const newUser = new User({
      username,
      email,
      dob: new Date(dob),
    })

    res.status(200);
    await newUser.save()
    res.send("User registered successfully");

  } catch (error) {
    console.log(error.message);
    res.status(400);
    res.json({
      data: "Error saving user data",
      message: error.message
    });
  }
}
module.exports = {
  addUser
}