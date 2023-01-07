const { default: mongoose } = require('mongoose')
const productCollection=require('../models/productSchema')
const catCollection = require("../models/categorySchema")

module.exports={
    productPage:async (req,res)=>{
        await productCollection.findOne({_id:mongoose.Types.ObjectId(req.params.productid)})
        catData=await catCollection.find({action:true})
        res.render('../views/userFiles/userProductPage',{userData:req.session.userData,catData})
    }
}