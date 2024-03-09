const nodemailer = require('nodemailer');

function otp() {
  let otpgen = Math.floor(1000 + Math.random() * 9000);
  return otpgen;
}

function mailObject(email, otpgen) {
  let mailOptions = {
    from: 'jithinksunil96@gmail.com',
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
      user: 'jithinksunil96@gmail.com',
      pass: 'nskzhacimzlqfors', // password from gmail
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
