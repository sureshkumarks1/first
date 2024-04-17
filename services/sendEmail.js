const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const generateOTP = require("./generateOTP");
dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = expressAsyncHandler(async (email) => {
  
  
  const otp = generateOTP();

  

  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "OTP form shoecase.com",
    text: `Your OTP is: ${otp}`,
  };

  console.log(mailOptions)

  return otp;

  /*
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return false;
    } else {

      console.log("Email sent successfully!");
      return true;

    }
  });
  */
});

module.exports = { sendEmail };