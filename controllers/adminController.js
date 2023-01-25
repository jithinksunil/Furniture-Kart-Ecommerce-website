const userCollection=require('../models/userSchema')
const adminCollection=require('../models/adminSchema')
const catCollection=require('../models/categorySchema')
const productCollection = require('../models/productSchema')
const cartCollection=require('../models/cartShema')
const orderCollection = require('../models/orderSchema')
const couponCollection=require('../models/couponShema')
const bannerCollection = require('../models/bannerSchema')
const pdf=require('pdf-creator-node')
const fs=require('fs')
const path=require('path')
const cloudinary=require('../config/cloudinary')

const adminLogin = async(req,res)=>{
    try{
        res.render('./adminFiles/adminLoginPage')
    }
    catch(err){
        res.render('./404Error')
    }
}
const adminLoginValidation = async(req,res)=>{
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

const adminDashBoard = async(req,res)=>{

    try{
        let orderPerMonth=[]
        for (let i=1;i<=12;i++){
            let numberOfOrders=await orderCollection.find({orderMonth:i}).count()
            orderPerMonth.push(numberOfOrders)
        }
        
        let dashBoardData={
            users:await userCollection.count(),
            products:await productCollection.count(),
            orders:await orderCollection.count(),
            deliverd:await orderCollection.find({status:'Deliverd'}).count(),
            cancelled:await orderCollection.find({status:'Cancel'}).count(),
            pending:await orderCollection.find({status:'Pending'}).count(),
            outForDelivey:await orderCollection.find({status:'Out for delivey'}).count(),
            shipped:await orderCollection.find({status:'Shipped'}).count()
        }
        await orderCollection.find({status:'Deliverd'})
    
        res.render('./adminFiles/adminDashBoard',{data:dashBoardData,orderPerMonth})
    }
    catch(err){
        res.render('./404Error')
    }
}

const userManagement = async(req,res)=>{
    try{
        const users=await userCollection.find()
        res.render('./adminFiles/admin_userManagement',{userData:users})
    }
    catch(err){
        res.render('./404Error')
    }

}

const blockUser = async(req,res)=>{
    try{
        let jithin=await userCollection.updateOne({_id:req.query.id},{action:false})
        res.redirect('/admin/usermangement')
    }
    catch(err){
        res.render('./404Error')
    }
}
    

const unBlockUser = async(req,res)=>{
    try{
        await userCollection.updateOne({_id:req.query.id},{action:true})
        res.redirect('/admin/usermangement')
    }
    catch(err){
        res.render('./404Error')
    }

}

const categoryManagement = async(req,res)=>{
    try{
        let message=req.query.message
        let catData=await catCollection.find()
        res.render('./adminFiles/adminCatagories',{catData:catData,message})
        message=false
    }
    catch(err){
        res.render('./404Error')
    }
}

const addCategory = async(req,res)=>{
    if(req.file){
        try{

            const result = await cloudinary.uploader.upload(
                req.file.path,{
                    transformation: [
                    { width: 485, height: 575, gravity: "face", crop: "fill" }]
                }
            )

            await catCollection.insertMany(
                [{
                    catName:req.body.catName,
                    catImage:[{public_id:result.public_id, cloudunaryUrl:result.secure_url}]
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

const listCategoryAction = async(req,res)=>{
    try{
        await catCollection.updateOne({_id:req.query.id},{action:true})
        res.redirect('/admin/products/categorymangement')
    }
    catch(err){
        res.render('./404Error')
    }
}

const unListCategoryAction = async(req,res)=>{
    try{
        await catCollection.updateOne({_id:req.query.id},{action:false})
        res.redirect('/admin/products/categorymangement')
    }
    catch(err){
        res.render('./404Error')
    }
}

const productManagement = async(req,res)=>{
    try{
        let productData=await productCollection.find() 
        res.render('./adminFiles/adminProducts',{productData:productData})
    }
    catch(err){
        res.render('./404Error')
    }
}

const productAddPage = async(req,res)=>{
    try{
        let catData=await catCollection.find()
        res.render('./adminFiles/admin_addProductPage',{catData:catData})
    }
    catch(err){
        res.render('./404Error')
    }
}

const addProductCompleted = async(req,res)=>{
    if(req.files){
        try{

            const result = await cloudinary.uploader.upload(
                req.files[0].path,{
                    transformation: [
                    { width: 485, height: 485, gravity: "face", crop: "fill" }]
                }
            )

            await productCollection.insertMany(
                [{
                    productName:req.body.productName,
                    productImage:[{public_id:result.public_id, cloudunaryUrl:result.secure_url}],
                    category:req.body.catagoryName,
                    description:req.body.description,
                    rate:req.body.rate,
                    stock:req.body.stock,
                    action:true
                }]
            )

            for(let i=1;i<req.files.length;i++){
                const result = await cloudinary.uploader.upload( 
                    req.files[i].path,{
                        transformation: [
                        { width: 485, height: 485, gravity: "face", crop: "fill" }]
                    }
                )
                await productCollection.updateOne({productName:req.body.productName,description:req.body.description},{
                    $push:{productImage:{public_id:result.public_id, cloudunaryUrl:result.secure_url}}
                })
            }

            res.redirect('/admin/products/productmangement')
        }
        catch(err){
            console.log(err);
            res.redirect('/admin/products/productmangement')
        }
    }
    else{
        res.redirect('/admin/products/productmangement?message=Select jpeg format')
    }

}

const listProductAction = async(req,res)=>{
    try{
        await productCollection.updateOne({_id:req.query.id},{action:true})
        res.redirect('/admin/products/productmangement')
    }
    catch(err){
        res.render('./404Error')
    }

}

const unListProductAction = async(req,res)=>{
    try{
        await productCollection.updateOne({_id:req.query.id},{action:false})
        res.redirect('/admin/products/productmangement')
    }
    catch(err){
        res.render('./404Error')
    }
}

const orderManagement = async(req,res)=>{
    try{
        let salesReport=req.query.genarated
        let path=req.query.path
    
        let orderData=await orderCollection.aggregate([{$lookup:{
            from:'user_collections',
            localField:'userId',
            foreignField:'_id',
            as:'user'
        }}])
        res.render('./adminFiles/adminOrderManagement',{orderData,salesReport,path})
    }
    catch(err){
        res.render('./404Error')
    }

}

const orderStatusManagement = async(req,res)=>{
    try{
        await orderCollection.updateOne({_id:req.query.orderId},{status:req.query.status})
        res.json({status:true})
    }
    catch(err){
        res.render('./404Error')
    }
}


const salesReport = async(req,res)=>{
    try{
        let orderData=await orderCollection.aggregate([{$match:{status:'Deliverd'}},{$lookup:{
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
            res.redirect(filepath)
        }).catch(err=>{
            console.log(err)
        })
    }
    catch(err){
        res.render('./404Error')
    }

}

const couponManagement = async(req,res)=>{
    try{
        let couponData= await couponCollection.find()
    
        res.render('./adminFiles/adminCouponManagement',{couponData})
    }
    catch(err){
        res.render('./404Error')
    }

}

const addCouponCompleted = async(req,res)=>{
    try{
        await couponCollection.insertMany([{
            couponName:req.body.couponName,
            couponCode:req.body.couponCode,
            discount:parseInt(req.body.discount),
            count:parseInt(req.body.countPerUser)
        }])
        res.redirect('/admin/coupons')
    }
    catch(err){
        res.render('./404Error')
    }

}

const couponListAndUnListActions = async(req,res)=>{
    try{
        if(req.query.list_CouponId){
            await couponCollection.updateOne({_id:req.query.list_CouponId},{status:true})
        }else if(req.query.unList_CouponId){
            await couponCollection.updateOne({_id:req.query.unList_CouponId},{status:false})
        }
        res.redirect('/admin/coupons')
    }
    catch(err){
        res.render('./404Error')
    }
}

const bannerManagement = async(req,res)=>{
    try{
        let bannerData= await bannerCollection.find()
        res.render('./adminFiles/adminBannerManagement',{bannerData})
    }
    catch(err){
        res.render('./404Error')
    }

}

const addBanner = async(req,res)=>{
    if(req.file){
        try{

            const result = await cloudinary.uploader.upload(
                req.file.path,{
                    transformation: [
                    { width: 1920, height: 950, gravity: "face", crop: "fill" }]
                }
            )

            
            await bannerCollection.insertMany([{
                bannerName:req.body.bannerLabel,
                bannerImage:{public_id:result.public_id, cloudunaryUrl:result.secure_url}
    
             }]
            )
            
            res.redirect('/admin/banners')
        }
        catch(err){
            res.redirect('/admin/banners')
        }
    }
    else{
        res.redirect('/admin/banners?message=Select jpeg format')
    }

}

const blockBanner = async(req,res)=>{
    try{
        
            await bannerCollection.updateOne({_id:req.query.id},{action:false})
        
            res.redirect('/admin/banners')
    }
    catch(err){
        res.render('./404Error')
    }
}

const unBlockBanner = async(req,res)=>{
    try{
        await bannerCollection.updateOne({_id:req.query.id},{action:true})
    
        res.redirect('/admin/banners')
    }
    catch(err){
        res.render('./404Error')
    }

}

const logOut = async(req,res)=>{
    try{
        req.session.destroy()
        res.redirect('/admin/login')
    }
    catch(err){
        res.render('./404Error')
    }
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
    orderStatusManagement,
    salesReport,
    couponManagement,
    addCouponCompleted,
    couponListAndUnListActions,
    bannerManagement,
    addBanner,
    blockBanner,
    unBlockBanner,
    logOut
}