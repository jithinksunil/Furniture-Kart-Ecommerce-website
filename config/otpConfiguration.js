const nodemailer = require('nodemailer');
const dotenv = require("dotenv")
dotenv.config()//will convert the .env file into an object
function otp() {
  let otpgen = Math.floor(1000 + Math.random() * 9000);
  return otpgen;
}

function mailObject(email, otpgen) {
  let mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email, //doseje1135@bitvoo.com
    subject: 'YOUR OTP',
    //   text: `enterotp`
    html: `<p>Dear user,
        Your otp is:${otpgen}</p>`,
  };
  return mailOptions;
}

function mailService(mailOptions) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD, // password from gmail
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {
  otp,
  mailObject,
  mailService,
};
