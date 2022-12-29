const productCollection=require('../models/productSchema')
const userCollection = require("../models/userSchema")

const otpfunctions=require('../config/otpConfiguration')

async function home(req,res){  //user login page

    let search=''
    
    let page=1
    let productData
    let limit=9;
    if(req.query.search){
        let search=req.query.search
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
        otpfunctions.mailService(mailOptions);
        
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

async function forgotPasswordNewPasswordPage(req,res){

    console.log(req.query.email);

    let userData=await userCollection.aggregate([{$match:{email:req.query.email}},{$project:{'email':1}}])
    try{   
        if(userData[0].email==req.query.email){
            res.render('./userFiles/forgotPasswordNewPasswordPage',{userEmail:userData[0].email})
        }
    }
    catch(err){
        res.redirect(`/user/forgotpassword?warning=${true}`)
    }
}

function forgotPasswordOtpPageRedirct(req,res){
    req.session.forgotPasswordEmail=req.query.userEmail
    req.session.password=req.body.password
    res.redirect('/forgotpassword/otppage')
}

function forgotPasswordOtpPage(req,res){
    let otpgen=otpfunctions.otp()
    let mailOptions=otpfunctions.mailObject(req.body.email,otpgen)
    otpfunctions.mailService(mailOptions);
    req.session.forgotPasswordOtp=otpgen
    
    let warning=req.query.warning

    setTimeout(() => {
        req.session.destroy()
        console.log('otp expired');
    },20000);
  
    res.render('./userFiles/forgotPasswordOtp',{warning})
}


async function forgotPasswordUpdation(req,res){

    if(req.session.forgotPasswordOtp==req.body.otp){

        await userCollection.updateOne({email:req.session.forgotPasswordEmail},{password:req.session.password})
        req.session.destroy()
        res.redirect('/')

    }
    else{
        res.redirect(`/forgotpassword/otppage?warning=${true}`)
    }
    
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
    forgotPasswordPage,
    forgotPasswordNewPasswordPage,
    forgotPasswordOtpPageRedirct,
    forgotPasswordOtpPage,
    forgotPasswordUpdation,
    userHome
}

