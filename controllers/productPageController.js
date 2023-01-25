const { default: mongoose } = require('mongoose')
const productCollection=require('../models/productSchema')
const catCollection = require("../models/categorySchema")
const cartCollection = require("../models/cartShema")

module.exports={
    productPage:async (req,res)=>{
    
        let productData=await productCollection.findOne({_id:mongoose.Types.ObjectId(req.params.productid)})
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
        res.render('../views/userFiles/userProductPage',{userData:req.session.userData,catData,productData,cartCount})
    },

    categoriesPage:async (req,res)=>{
        
        let catData=await catCollection.find({action:true})
        let search=req.query.search||''
        let page=req.query.page||1
        let limit=4
        let productData;
        let count;
        let sort=parseInt(req.query.sort)||1

        if(req.params.category=='all'){
            productData=await productCollection.find({action:true,$or:[
                {productName:{$regex:search,$options:'i'}},
                {description:{$regex:search,$options:'i'}},
                {category:{$regex:search,$options:'i'}}
            ]}).skip((page-1)*limit).limit(limit).sort({rate:sort})
            count=await productCollection.find({action:true,$or:[
                {productName:{$regex:search,$options:'i'}},
                {description:{$regex:search,$options:'i'}},
                {category:{$regex:search,$options:'i'}}
            ]}).count()
        }
        else{
            productData=await productCollection.find({action:true,category:req.params.category,$or:[
                {productName:{$regex:search,$options:'i'}},
                {description:{$regex:search,$options:'i'}},
                {category:{$regex:search,$options:'i'}}
            ]}).skip((page-1)*limit).limit(limit).sort({rate:sort})
            count=await productCollection.find({action:true,category:req.params.category,$or:[
                {productName:{$regex:search,$options:'i'}},
                {description:{$regex:search,$options:'i'}},
                {category:{$regex:search,$options:'i'}}
            ]}).count()
        }
    
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
    
        res.render('./userFiles/categoriesPage',{
            userData:req.session.userData,
            productData:productData,
            totalPages:(count/limit),
            currentPage:page,
            catName:req.params.category,
            catData,                                                                                                                                                                                            
            cartCount,
            search,
            sort
        })
    }
}