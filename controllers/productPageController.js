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
    }
}