const createError = require('http-errors');

const productCollection=require('../models/productSchema')
const catCollection = require("../models/categorySchema")
const cartCollection = require("../models/cartShema")
const userCollection = require("../models/userSchema")
const otpfunctions=require('../config/otpConfiguration')
const bannerCollection = require('../models/bannerSchema')

const { query } = require('express')
const { search } = require('../routes/userRoute')
const home = async(req,res)=>{
    
    let bannerData=await bannerCollection.find({action:true})
    let catData=await catCollection.find({action:true})
    let cartCount=0
    try{
        let userCart=await cartCollection.findOne({userId:req.session?.userData?._id})
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

const userLogin = async(req,res,next)=>{  //user login page
    try{
        let warning=req.query.warning
        res.render('./userFiles/userLoginPage',{userData:req.session.userData,warning})
    }
    catch(err){
        res.next(createError(500))
    }
}

const userValidation = async(req,res)=>{  //user login validation
    
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

const userLogout = async(req,res)=>{  //user login page
    try{
        req.session.destroy()
        res.redirect('/')
    }
    catch(err){
        res.render('./404Error')
    }
}

const userRegistration = async(req,res)=>{  //user login page
    try{
        let warning=req.query.warning
        let catData=await catCollection.find({action:true})
        res.render('./userFiles/userRegistrationPage',{userData:req.session.userData,warning,catData})
    }
    catch(err){
        res.render('./404Error')
    }
}


const userRegistrationOtp = async(req,res)=>{  //user login page
    try{
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
    catch(err){
        res.render('./404Error')
    }
}
    
const userRegistrationOtpValidation = async(req,res)=>{  //user login page
    try{
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
        catch(err){
            res.render('./404Error')
        }
}

const forgotPasswordPage = async(req,res)=>{
    try{
        let warning=req.query.warning
        res.render('./userFiles/forgotPasswordPage',{warning})
    }
    catch(err){
        res.render('./404Error')
    }
}


const forgotPasswordOtpPage = async(req,res)=>{
    try{
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
    catch(err){
        res.render('./404Error')
    }

}


const forgotPasswordNewPasswordPage = async(req,res)=>{
    try{
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
    catch(err){
        res.render('./404Error')
    }

}

const forgotPasswordUpdation = async(req,res)=>{
    try{
        await userCollection.updateOne({email:req.body.userEmail},{password:req.body.password})
        req.session.userData=await userCollection.findOne({email:req.body.userEmail})
        res.redirect('/')
    }
    catch(err){
        res.render('./404Error')
    }

}

const userProfile = async(req,res)=>{
    
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

const changePassword = async(req,res)=>{
    
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

const updatePassword = async(req,res)=>{
    try{
        await userCollection.updateOne({_id:req.session.userData._id,password:req.body.currentPassword},{password:req.body.newPassword})
        res.redirect('/profile')
    }
    catch(err){
        res.render('./404Error')
    }
    
}

const editAccount = async(req,res)=>{
    
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

const updateAccount = async(req,res)=>{
    try{
        let userData={
            fName:req.body.fName,
            lName:req.body.lName,
            age:req.body.age
        }
        
        await userCollection.updateOne({_id:req.session.userData._id,password:req.body.currentPassword},userData)
        res.redirect('/profile')
    }
    catch(err){
        res.render('./404Error')
    }

}

const errorRouter=(req,res,next)=>{
    let error=new Error('newError occured')
    next()
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
    updateAccount,
    errorRouter
}

