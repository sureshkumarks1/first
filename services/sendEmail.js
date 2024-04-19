const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const generateOTP = require("./generateOTP");
dotenv.config();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

//console.log(transporter)

const sendEmail = expressAsyncHandler(async (email) => {
  
  
  const otp = generateOTP();

  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "OTP form shoecase.com",
    text: `Your OTP is: ${otp}`,
  };

  //console.log(mailOptions)

  
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return false;
    } else {    
      console.log("Mail sent")
      return otp;
    }
  });
  return otp;
});

module.exports = { sendEmail };