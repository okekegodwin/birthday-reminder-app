const express = require("express");
const { addUser } = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.post("/user", addUser);

module.exports = userRouter;