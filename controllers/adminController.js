const userCollection=require('../models/userSchema')
const catCollection=require('../models/categorySchema')
const productCollection = require('../models/productSchema')

function adminLogin(req,res){
    
    res.render('./adminFiles/adminLoginPage')
}

function adminLoginValidation(req,res){
    res.redirect('/admin/dashboard')
}

async function adminDashBoard(req,res){
    let dashBoardData={
        users:await userCollection.count(),
        products:await productCollection.count()
    }
    res.render('./adminFiles/adminDashBoard',{data:dashBoardData})
}

async function userManagement(req,res){

    const users=await userCollection.find()
    res.render('./adminFiles/admin_userManagement',{userData:users})
}

async function blockUser(req,res){

    await userCollection.updateOne({_id:req.query.id},{action:false})
    res.redirect('/admin/usermangement')
}

async function unBlockUser(req,res){

    await userCollection.updateOne({_id:req.query.id},{action:true})
    res.redirect('/admin/usermangement')
}

async function categoryManagement(req,res){
    let catData=await catCollection.find()
    res.render('./adminFiles/adminCatagories',{catData:catData})
}

async function addCategory(req,res){
    await catCollection.insertMany([{catName:req.body.catName}])
    res.redirect('/admin/products/categorymangement')
}

async function listCategoryAction(req,res){
    await catCollection.updateOne({_id:req.query.id},{action:true})
    res.redirect('/admin/products/categorymangement')
}

async function unListCategoryAction(req,res){
    await catCollection.updateOne({_id:req.query.id},{action:false})
    res.redirect('/admin/products/categorymangement')
}

async function productManagement(req,res){
    let productData=await productCollection.find() 
    res.render('./adminFiles/adminProducts',{productData:productData})
}

async function listProductAction(req,res){
    await productCollection.updateOne({_id:req.query.id},{action:true})
    res.redirect('/admin/products/productmangement')
}

async function unListProductAction(req,res){
    await productCollection.updateOne({_id:req.query.id},{action:false})
    res.redirect('/admin/products/productmangement')
}

function orderManagement(req,res){
    res.render('./adminFiles/adminOrderManagement')
}

function couponManagement(req,res){
    res.render('./adminFiles/adminCouponManagement')
}

module.exports={
    adminLogin,
    adminLoginValidation,
    adminDashBoard,
    userManagement,
    blockUser,
    unBlockUser,
    categoryManagement,
    addCategory,
    listCategoryAction,
    unListCategoryAction,
    productManagement,
    listProductAction,
    unListProductAction,
    orderManagement,
    couponManagement
}