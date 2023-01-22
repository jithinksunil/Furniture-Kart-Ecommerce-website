const productCollection=require('../models/productSchema')
const catCollection = require("../models/categorySchema")
const cartCollection = require("../models/cartShema")
const userCollection = require("../models/userSchema")
const otpfunctions=require('../config/otpConfiguration')
const bannerCollection = require('../models/bannerSchema')
const { query } = require('express')
const { search } = require('../routes/userRoute')
async function home(req,res){

    let bannerData=await bannerCollection.find({action:true})
    let catData=await catCollection.find({action:true})
    let cartCount=0
    try{
        let userCart=await cartCollection.findOne({userId:req.session.userData._id})
        for(let i=0;i<userCart.products.length;i++){
            cartCount=cartCount+userCart.products[i].quantity
        }
    }
    catch(err){
        console.log(err);
    }
    recProducts=await productCollection.find().limit(4)
    res.render('./userFiles/userHomePage',{catData,recProducts,userData:req.session.userData,bannerData,cartCount})
}

function userLogin(req,res){  //user login page
    let warning=req.query.warning
    res.render('./userFiles/userLoginPage',{userData:req.session.userData,warning})
}

async function userValidation(req,res){  //user login validation
    let userData=await userCollection.findOne({email:req.body.email})
    try{
        if(userData.password==req.body.password){
            req.session.userData=userData
            res.redirect('/')
        }
        else{
            res.redirect(`/login?warning=${true}`)
        }
    }
    catch(err){
        res.redirect(`/login?warning=${true}`)
    }
}

function userLogout(req,res){  //user login page
    req.session.destroy()
    res.redirect('/')
}

async function userRegistration(req,res){  //user login page
    let warning=req.query.warning
    let catData=await catCollection.find({action:true})
    res.render('./userFiles/userRegistrationPage',{userData:req.session.userData,warning,catData})
}


async function userRegistrationOtp(req,res){  //user login page
    let newUser
    console.log(req.body);
    newUser=await userCollection.findOne({email:req.body.email})
    console.log(newUser);
    if(newUser){
            
        res.redirect(`/registration?warning=${true}`)
        
    }
    else{

        req.session.registrationData={
            fName:req.body.fName,
            lName:req.body.lName,
            age:req.body.age,
            email:req.body.email,
            password:req.body.password
        }
        let otpgen=otpfunctions.otp()
        console.log(otpgen);
        let mailOptions=otpfunctions.mailObject(req.body.email,otpgen)
        otpfunctions.mailService(mailOptions)
        req.session.registrationData.otp= otpgen
        req.session.registrationData.expiry=Date.now()+60000
        res.render('./userFiles/otp')
    }
}
    
async function userRegistrationOtpValidation(req,res){  //user login page
    let currentTime=Date.now()
    let expiryTime=req.session.registrationData.expiry
    let otp=req.session.registrationData.otp

    if(currentTime<=expiryTime&&otp==req.body.otp){

        await userCollection.insertMany([
            {
                fName:req.session.registrationData.fName,
                lName:req.session.registrationData.lName,
                age:req.session.registrationData.age,
                email:req.session.registrationData.email,
                password:req.session.registrationData.password
            }
        ])
        req.session.userData=req.session.registrationData
        req.session.registrationData=null
        res.redirect('/')
    }
}

function forgotPasswordPage(req,res){
    let warning=req.query.warning
    res.render('./userFiles/forgotPasswordPage',{warning})
}


async function forgotPasswordOtpPage(req,res){

    let userEmail=req.query.userEmail
    let userData=await userCollection.findOne({email:userEmail})
    let warning=req.query.warning

    if(userData){
        if(!warning){
            let otpgen=otpfunctions.otp()
            console.log(otpgen);
            let mailOptions=otpfunctions.mailObject(userEmail,otpgen)
            otpfunctions.mailService(mailOptions);
            req.session.forgotPasswordOtp=otpgen
            req.session.forgotPasswordOtpExpiry=Date.now()+60000
        }
        res.render('./userFiles/forgotPasswordOtp',{userEmail,warning:req.query.warning})
    }
    else{
        res.redirect(`/forgotpassword?warning=${true}`)
    }
}


async function forgotPasswordNewPasswordPage(req,res){

    let currentTime=Date.now()
    let expiryTime=req.session.forgotPasswordOtpExpiry
    let otp=req.session.forgotPasswordOtp
    let userEmail=req.body.userEmail

    console.log(currentTime);
    console.log(expiryTime);

    if(currentTime<=expiryTime && otp==req.body.otp){
        console.log('hello');
        res.render('./userFiles/forgotPasswordNewPasswordPage',{userEmail})
    }
    else{
        res.redirect(`/forgotpassword/otppage?warning=${true}&userEmail=${userEmail}`)
    }
}

async function forgotPasswordUpdation(req,res){

    await userCollection.updateOne({email:req.body.userEmail},{password:req.body.password})
    req.session.userData=await userCollection.findOne({email:req.body.userEmail})
    res.redirect('/')
}

async function userProfile(req,res){

    const userData=await userCollection.findOne({_id:req.session.userData._id})
    let catData=await catCollection.find({action:true})
    let cartCount=0
    try{
        let userCart=await cartCollection.findOne({userId:req.session.userData._id})
        for(let i=0;i<userCart.products.length;i++){
            cartCount=cartCount+userCart.products[i].quantity
        }
    }
    catch(err){
        console.log(err);
    }
    res.render('./userFiles/userProfilePage',{userData,cartCount,catData})
}

async function changePassword(req,res){
    
    const userData=await userCollection.findOne({_id:req.session.userData._id})
    let catData=await catCollection.find({action:true})
    let cartCount=0
    try{
        let userCart=await cartCollection.findOne({userId:req.session.userData._id})
        for(let i=0;i<userCart.products.length;i++){
            cartCount=cartCount+userCart.products[i].quantity
        }
    }
    catch(err){
        console.log(err);
    }
    res.render('./userFiles/userChangePasswordPage',{userData,cartCount,catData})
}

async function updatePassword(req,res){
    
    await userCollection.updateOne({_id:req.session.userData._id,password:req.body.currentPassword},{password:req.body.newPassword})
    res.redirect('/profile')
}

async function editAccount(req,res){
    
    let userData=await userCollection.findOne({_id:req.session.userData._id})
    let catData=await catCollection.find({action:true})
    let cartCount=0
    try{
        let userCart=await cartCollection.findOne({userId:req.session.userData._id})
        for(let i=0;i<userCart.products.length;i++){
            cartCount=cartCount+userCart.products[i].quantity
        }
    }
    catch(err){
        console.log(err);
    }
    res.render('./userFiles/editAccountPage',{userData,cartCount,catData})
}

async function updateAccount(req,res){

    let userData={
        fName:req.body.fName,
        lName:req.body.lName,
        age:req.body.age,
        email:req.body.email
    }
    
    await userCollection.updateOne({_id:req.session.userData._id,password:req.body.currentPassword},userData)
    res.redirect('/profile')
}

module.exports={
    home,
    userLogin,
    userValidation,
    userLogout,
    userRegistration,
    userRegistrationOtp,
    userRegistrationOtpValidation,
    forgotPasswordPage,
    forgotPasswordNewPasswordPage,
    forgotPasswordOtpPage,
    forgotPasswordUpdation,
    userProfile,
    changePassword,
    updatePassword,
    editAccount,
    updateAccount
}

