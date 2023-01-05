const userCollection=require('../models/userSchema')
const adminCollection=require('../models/adminSchema')
const catCollection=require('../models/categorySchema')
const productCollection = require('../models/productSchema')
const cartCollection=require('../models/cartShema')
const orderCollection = require('../models/orderSchema')
const couponCollection=require('../models/couponShema')
const bannerCollection = require('../models/bannerSchema')
const sharp=require('sharp')
const pdf=require('pdf-creator-node')
const fs=require('fs')
const path=require('path')

function adminLogin(req,res){
    res.render('./adminFiles/adminLoginPage')
}
async function adminLoginValidation(req,res){
    let admin=await adminCollection.findOne({email:req.body.email})
    try{
        if(admin.password===req.body.password){
            req.session.admin=true
            res.redirect('/admin/dashboard')
        }
        else{
            res.redirect('/admin/login')
        }
    }
    catch(err){
        res.redirect('/admin/login')
    }
}

async function adminDashBoard(req,res){
    let dashBoardData={
        users:await userCollection.count(),
        products:await productCollection.count(),
        orders:await orderCollection.count()
    }
    res.render('./adminFiles/adminDashBoard',{data:dashBoardData})
}

async function userManagement(req,res){

    const users=await userCollection.find()
    res.render('./adminFiles/admin_userManagement',{userData:users})
}

async function blockUser(req,res){
    
    let jithin=await userCollection.updateOne({_id:req.query.id},{action:false})
    res.redirect('/admin/usermangement')
}

async function unBlockUser(req,res){

    await userCollection.updateOne({_id:req.query.id},{action:true})
    res.redirect('/admin/usermangement')
}

async function categoryManagement(req,res){
    let message=req.query.message
    let catData=await catCollection.find()
    res.render('./adminFiles/adminCatagories',{catData:catData,message})
    message=false
}

async function addCategory(req,res){
    if(req.file){
        console.log(req.file)
        try{
            const name=Date.now()+'-'+req.file.originalname;
            await sharp(req.file.buffer).resize({width:10000,height:10000}).toFile('./public/categories/images/'+name)
            await catCollection.insertMany(
                [{
                    catName:req.body.catName,
                    catImage:name,
                }]
            )
            res.redirect('/admin/products/categorymangement')
        }
        catch(err){
            res.redirect('/admin/products/categorymangement')
        }
    }
    else{
        res.redirect('/admin/products/categorymangement?message=Select jpeg format')
    }

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

async function productAddPage(req,res){
    let catData=await catCollection.find()
    
    res.render('./adminFiles/admin_addProductPage',{catData:catData})
}

async function addProductCompleted(req,res){

    if(req.file){
        console.log(req.file)
        try{
            const name=Date.now()+'-'+req.file.originalname;
            await sharp(req.file.buffer).resize({width:10000,height:12000}).toFile('./public/products/images/'+name)
            await productCollection.insertMany(
                [{
                    productName:req.body.productName,
                    productImage:name,
                    category:req.body.catagoryName,
                    description:req.body.description,
                    rate:req.body.rate,
                    stock:req.body.stock,
                    action:true
                }]
            )
            res.redirect('/admin/products/productmangement')
        }
        catch(err){
            res.redirect('/admin/products/productmangement')
        }
    }
    else{
        res.redirect('/admin/products/productmangement?message=Select jpeg format')
    }

}

async function listProductAction(req,res){
    await productCollection.updateOne({_id:req.query.id},{action:true})
    res.redirect('/admin/products/productmangement')
}

async function unListProductAction(req,res){
    await productCollection.updateOne({_id:req.query.id},{action:false})
    res.redirect('/admin/products/productmangement')
}

async function orderManagement(req,res){

    let salesReport=req.query.genarated
    let path=req.query.path

    let orderData=await orderCollection.aggregate([{$lookup:{
        from:'user_collections',
        localField:'userId',
        foreignField:'_id',
        as:'user'
    }}])
    console.log(orderData)
    res.render('./adminFiles/adminOrderManagement',{orderData,salesReport,path})
}


async function salesReport(req,res){

    let orderData=await orderCollection.aggregate([{$match:{status:'completed'}},{$lookup:{
        from:'user_collections',
        localField:'userId',
        foreignField:'_id',
        as:'user'
    }}])
    
    let salesData=[];//this array is created because the sales report template cannot read the data like this.user[0].fName??????????????????
    for(let i=0;i<orderData.length;i++){
        let order={
            address:orderData[i].address.houseName,
            fName:orderData[i].user[0].fName,
            netAmount:orderData[i].netAmount,
            status:orderData[i].status,
            orderDate:orderData[i].orderDate
        }
        salesData.push(order)
    }

    let totalAmount=0;
    for(let i=0;i<orderData.length;i++){
        totalAmount=totalAmount+orderData[i].netAmount
    }
    
    const html=fs.readFileSync(path.join(__dirname,'../views/adminFiles/salesReport/reportTemplate.html'),'utf-8')
    const filename=Math.random()+'_doc'+'.pdf'
    const filepath='/public/salesReports/'+filename

    const document={
        html:html,
        data:{salesData,totalAmount},
        path:'./public/salesReports/'+filename
    }
    pdf.create(document).then(resolve=>{
        console.log(resolve)
        res.redirect(`/admin/orders?genarated=${true}&path=${filepath}`)
    }).catch(err=>{
        console.log(err);
    })
}

async function couponManagement(req,res){

    let couponData= await couponCollection.find()

    res.render('./adminFiles/adminCouponManagement',{couponData})
}

async function couponListAndUnListActions(req,res){
    if(req.query.list_CouponId){
        await couponCollection.updateOne({_id:req.query.list_CouponId},{status:true})
    }else if(req.query.unList_CouponId){
        await couponCollection.updateOne({_id:req.query.unList_CouponId},{status:false})
    }
    res.redirect('/admin/coupons')
}

async function bannerManagement(req,res){

    let bannerData= await bannerCollection.find()
    res.render('./adminFiles/adminBannerManagement',{bannerData})
}

async function blockBanner(req,res){
    console.log(req.query.id);

    await bannerCollection.updateOne({_id:req.query.id},{action:false})

    res.redirect('/admin/banners')
}

async function unBlockBanner(req,res){

    await bannerCollection.updateOne({_id:req.query.id},{action:true})

    res.redirect('/admin/banners')
}

function logOut(req,res){
    req.session.destroy()
    res.redirect('/admin/login')
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
    productAddPage,
    addProductCompleted,
    listProductAction,
    unListProductAction,
    orderManagement,
    salesReport,
    couponManagement,
    couponListAndUnListActions,
    bannerManagement,
    blockBanner,
    unBlockBanner,
    logOut
}