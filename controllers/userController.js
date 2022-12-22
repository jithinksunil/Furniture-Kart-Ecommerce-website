const nodemailer=require('nodemailer')

const userCollection = require("../models/userSchema")

function home(req,res){  //user login page
    res.render('./userFiles/homePage')
}

function userLogin(req,res){  //user login page
    res.render('./userFiles/userLoginPage')
}

function userValidation(req,res){  //user login validation
    let email="jithin@gmail.com"
    let password="1"
    if(email==req.body.email&&password==req.body.password){
        res.redirect('/')
    }
}

function userLogout(req,res){  //user login page
    res.redirect('/')
}

function userRegistration(req,res){  //user login page
    res.render('./userFiles/userRegistrationPage')
}

function userOtp(req,res){  //user login page
    
    let otpgen= Math.floor(1000 + Math.random() * 9000)
    console.log(otpgen);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jithinksunil96@gmail.com',
            pass: 'nskzhacimzlqfors'  // password from gmail
        }
    });

    var mailOptions = {
        from: 'jithinksunil96@gmail.com',
        to: req.body.email,  //doseje1135@bitvoo.com
        subject: 'YOUR OTP',
        //   text: `enterotp`
        html: `<p>${otpgen}</p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })

    let userData={
        fName:req.body.fName,
        lName:req.body.lName,
        age:req.body.age,
        email:req.body.email,
        password:req.body.password,
    }
    req.session.userData=userData
    req.session.otp= otpgen
    console.log(req.session);
    
    setTimeout(() => {
        // req.session.otp= Math.floor(1000 + Math.random() * 9000)//reassigning session inside the settime out is not reflecting the changes out side.why?
        req.session.destroy()
        console.log('otp expired');
    },20000);
    res.render('./userFiles/otp')
}


async function otpValidation(req,res){  //user login page
    
    if(req.session.otp==req.body.otp){
        await userCollection.insertMany([
            {
                fName:req.session.userData.fName,
                lName:req.session.userData.lName,
                age:req.session.userData.age,
                email:req.session.userData.email,
                password:req.session.userData.password
            }
        ])
        res.redirect('/')
    }
    else{
        res.send('otp expired')
    }
}

module.exports={
    home,
    userLogin,
    userValidation,
    userLogout,
    userRegistration,
    userOtp,
    otpValidation
}