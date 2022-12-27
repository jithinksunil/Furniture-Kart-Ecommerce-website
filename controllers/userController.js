const nodemailer=require('nodemailer')
const productCollection=require('../models/productSchema')
const userCollection = require("../models/userSchema")

async function home(req,res){  //user login page
    let search=''
    let page=1
    let productData
    let limit=12;
    if(req.query.search){
        search=req.query.search
  
    }
    if(req.query.page){
        page=parseInt(req.query.page)
    }
    productData=await productCollection.find({action:true,$or:[
        {productName:{$regex:search,$options:'i'}},
        {description:{$regex:search,$options:'i'}},
        {category:{$regex:search,$options:'i'}}
    ]}).limit(limit).skip((page-1)*limit)

    let count=await productCollection.find({action:true,$or:[
        {productName:{$regex:search,$options:'i'}},
        {description:{$regex:search,$options:'i'}},
        {category:{$regex:search,$options:'i'}}
    ]}).count()

    res.render('./userFiles/homePage',{
        userData:req.session.userData,
        productData:productData,
        totalPages:(count/limit),
        currentPage:page
    })
}

function userLogin(req,res){  //user login page
    res.render('./userFiles/userLoginPage',{userData:req.session.userData})
}

async function userValidation(req,res){  //user login validation
    let userData=await userCollection.findOne({email:req.body.email})
    try{
        if(userData.password==req.body.password){
            req.session.userData=userData
            res.redirect('/')
        }
        else{
            res.redirect('/user/login')
        }
    }
    catch(err){
        res.redirect('/user/login')
    }
}

function userLogout(req,res){  //user login page
    req.session.destroy()
    console.log(req.session);
    res.redirect('/')
}

function userRegistration(req,res){  //user login page
    res.render('./userFiles/userRegistrationPage',{userData:req.session.userData})
}

function userRegistrationOtp(req,res){  //user login page
    
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
    req.session.registrationData=userData
    req.session.otp= otpgen
    console.log(req.session);
    
    setTimeout(() => {
        // req.session.otp= Math.floor(1000 + Math.random() * 9000)//reassigning session inside the settime out is not reflecting the changes out side.why?
        req.session.destroy()
        console.log('otp expired');
    },20000);
    res.render('./userFiles/otp')
}


async function userRegistrationOtpValidation(req,res){  //user login page
    
    if(req.session.otp==req.body.otp){
        await userCollection.insertMany([
            {
                fName:req.session.registrationData.fName,
                lName:req.session.registrationData.lName,
                age:req.session.registrationData.age,
                email:req.session.registrationData.email,
                password:req.session.registrationData.password
            }
        ])
        req.session.destroy()
        res.redirect('/')
    }
    else{
        res.send('otp expired')
    }
}

function forgotPassword(req,res){
    res.render('./userFiles/forgotPasswordPage')
}

function forgotPasswordOtp(req,res){

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

    req.session.forgotPasswordEmail=req.body.email
    req.session.forgotPasswordOtp=otpgen
    
    setTimeout(() => {
        req.session.destroy()
        console.log('otp expired');
    },20000);

    res.render('./userFiles/forgotPasswordOtp')
    
}

function forgotPasswordOtpValidation(req,res){
    if(req.session.forgotPasswordOtp==req.body.otp){
        res.render('./userFiles/newPasswordPage')
    }
}

async function forgotPasswordUpdation(req,res){
    await userCollection.updateOne({email:req.session.forgotPasswordEmail},{password:req.body.password})
    res.redirect('/')
}

function userHome(req,res){
    res.render('./userFiles/userHomePage')
}

module.exports={
    home,
    userLogin,
    userValidation,
    userLogout,
    userRegistration,
    userRegistrationOtp,
    userRegistrationOtpValidation,
    forgotPassword,
    forgotPasswordOtp,
    forgotPasswordOtpValidation,
    forgotPasswordUpdation,
    userHome
}