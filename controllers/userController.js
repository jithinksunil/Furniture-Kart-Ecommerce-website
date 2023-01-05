const productCollection=require('../models/productSchema')
const catCollection = require("../models/categorySchema")
const userCollection = require("../models/userSchema")
const otpfunctions=require('../config/otpConfiguration')
const bannerCollection = require('../models/bannerSchema')
const { query } = require('express')

async function home(req,res){

    let bannerData=await bannerCollection.find({action:true})
    console.log(bannerData)
    catData=await catCollection.find()
    recProducts=await productCollection.find().limit(6)
    res.render('./userFiles/userHomePage',{catData,recProducts,userData:req.session.userData,bannerData})
}

async function shopPage(req,res){  //user login page

    // let search=''
    
    // let page=1
    // let productData
    // let limit=9;
    // if(req.query.search){
    //     let search=req.query.search
    // }
    // if(req.query.page){
    //     page=parseInt(req.query.page)
    // }
    // productData=await productCollection.find({action:true,$or:[
    //     {productName:{$regex:search,$options:'i'}},
    //     {description:{$regex:search,$options:'i'}},
    //     {category:{$regex:search,$options:'i'}}
    // ]}).limit(limit).skip((page-1)*limit)

    // let count=await productCollection.find({action:true,$or:[
    //     {productName:{$regex:search,$options:'i'}},
    //     {description:{$regex:search,$options:'i'}},
    //     {category:{$regex:search,$options:'i'}}
    // ]}).count()

    // res.render('./userFiles/homePage',{
    //     userData:req.session.userData,
    //     productData:productData,
    //     totalPages:(count/limit),
    //     currentPage:page
    // })
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
            res.redirect(`/user/login?warning=${true}`)
        }
    }
    catch(err){
        res.redirect(`/user/login?warning=${true}`)
    }
}

function userLogout(req,res){  //user login page
    req.session.destroy()
    res.redirect('/')
}

function userRegistration(req,res){  //user login page
    let warning=req.query.warning
    res.render('./userFiles/userRegistrationPage',{userData:req.session.userData,warning})
}

function jithin(a){
    a();
}


async function userRegistrationOtp(req,res){  //user login page

    let newUser=await userCollection.aggregate([{$match:{email:req.body.email}},{$project:{"email":1}}])
    console.log(newUser)
    try{
        if(req.body.email==newUser[0].email){
            
            res.redirect(`/user/registration?warning=${true}`)
            
        }
    }
    catch(err){

        let otpgen=otpfunctions.otp()
        let mailOptions=otpfunctions.mailObject(req.body.email,otpgen)
        otpfunctions.mailService(mailOptions)
        
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

function forgotPasswordPage(req,res){
    let warning=req.query.warning
    res.render('./userFiles/forgotPasswordPage',{warning})
}


async function forgotPasswordOtpPage(req,res){

    let userData=await userCollection.aggregate([{$match:{email:req.query.userEmail}},{$project:{'email':1}}])
    
    try{   
        if(userData[0].email==req.query.userEmail){
            
            let userEmail=req.query.userEmail

            let warning=req.query.warning
            if(!warning){
                let otpgen=otpfunctions.otp()
                let mailOptions=otpfunctions.mailObject(req.query.userEmail,otpgen)
                otpfunctions.mailService(mailOptions);
                req.session.forgotPasswordOtp=otpgen
                setTimeout(() => {
                    req.session.destroy()
                    console.log('otp expired');
                },20000);
            }
            
            res.render('./userFiles/forgotPasswordOtp',{warning,userEmail})
        }
    }
    catch(err){
        res.redirect(`/user/forgotpassword?warning=${true}`)
    }
}


async function forgotPasswordNewPasswordPage(req,res){

    if(req.session.forgotPasswordOtp==req.body.otp){
        req.session.destroy()
        res.render('./userFiles/forgotPasswordNewPasswordPage',{userEmail:req.query.userEmail})

    }
    else{
        req.session.destroy()
        res.redirect(`/user/forgotpassword/otppage?warning=${true}&userEmail=${req.query.userEmail}`)
    }
    
}

async function forgotPasswordUpdation(req,res){
    console.log(req.query.userEmail);
    console.log(req.body.password);

    await userCollection.updateOne({email:req.query.userEmail},{password:req.body.password})
    res.redirect('/')
    // req.session.forgotPasswordEmail=req.query.userEmail
    // req.session.password=req.body.password
    // res.redirect('/forgotpassword/otppage')
}

async function categoriesPage(req,res){
    let search=''
    
    let page=parseInt(req.params.page)
    // let productData
    let limit=2
    if(req.query.search){
        search=req.query.search
    }
    // if(req.query.page){
    //     page=parseInt(req.query.page)
    // }
    productData=await productCollection.find({action:true,category:req.params.category,$or:[
        {productName:{$regex:search,$options:'i'}},
        {description:{$regex:search,$options:'i'}},
        {category:{$regex:search,$options:'i'}}
    ]}).limit(limit).skip((page-1)*limit)

    let count=await productCollection.find({action:true,$or:[
        {productName:{$regex:search,$options:'i'}},
        {description:{$regex:search,$options:'i'}},
        {category:{$regex:search,$options:'i'}}
    ]}).count()

    res.render('./userFiles/categoriesPage',{
        userData:req.session.userData,
        productData:productData,
        totalPages:(count/limit),
        currentPage:page,
        catName:req.params.category
    })
    
    
    // res.render('./userFiles/categoriesPage',{productData})
}

module.exports={
    home,
    shopPage,
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
    categoriesPage
}

