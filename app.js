require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const { connectMongodb } = require("./config/dbConfig");
const userRouter = require("./routes/user.route");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const User = require("./models/user.model");

const app = express();
const PORT = process.env.PORT;

app.set("views", "views");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/v1", userRouter);

// connect to mongodb
connectMongodb()

app.get("/", (req, res) => {
  res.status(200);
  res.render("index");
})

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465, 
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
})

cron.schedule("0 7 * * *", () => {
  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  
  async function userBirthday() {
    const users = await User.find();
    users.forEach((user) => {
      const userDob = new Date(user.dob);

      if (userDob.getMonth() === todayMonth && userDob.getDate() === todayDate) {
        const mailOptions = {
          from: process.env.EMAIL,
          to: user.email,
          subject: "Happy Birthday",
          text: `Dear ${user.username}, \n\nWishing you a very Happy Birthday! Have a wonderful day!\n\nBest Regards, \nYour company`
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`Email sent: ${info.response}`)
          }
        })
      }
    })
  }

  userBirthday();

})

app.listen(PORT, () => {
  console.log(`app is running on http://localhost:${PORT}`);
})