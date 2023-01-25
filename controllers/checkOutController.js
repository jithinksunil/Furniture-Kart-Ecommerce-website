const { default: mongoose, trusted } = require('mongoose');
const cartCollection=require('../models/cartShema')
const catCollection=require('../models/categorySchema');
const userCollection = require('../models/userSchema');
const productCollection = require('../models/productSchema');
const couponCollection=require('../models/couponShema')

module.exports={
    checkOut:async (req,res)=>{
    
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

        let price=0;
        if(req.query.buyFrom=='cart'){
            let cartProducts=await cartCollection.aggregate([
                {$match:{userId:mongoose.Types.ObjectId(req.session.userData._id)}},
                {$unwind:'$products'},
                {$project:{prod:'$products.productId',nos:'$products.quantity'}},
                {
                    $lookup:{
                        from:'product_collections',
                        localField:'prod',
                        foreignField:'_id',
                        as:'productDetails'
                    }
                }
            ])

            for(let i=0;i<cartProducts.length;i++){
                price=price+(parseInt(cartProducts[i].nos)*parseInt(cartProducts[i].productDetails[0].rate))
            }

            let cartData=await cartCollection.findOne({userId:req.session.userData._id})
            req.session.orderProducts=cartData.products
        }
        else if(req.query.buyFrom=='productPage'){
            let productData=await productCollection.findOne({_id:req.query.productId})
            price=parseInt(productData.rate)
            req.session.orderProducts=[{productId:mongoose.Types.ObjectId(req.query.productId),quantity:1}]
        }
        
        let addressData=await userCollection.aggregate([{$match:{_id:mongoose.Types.ObjectId(req.session.userData._id)}},{$unwind:"$addresses"},{$project:{
            houseName:"$addresses.houseName",
            area:'$addresses.area',
            landmark:'$addresses.landmark',
            city:'$addresses.city',
            state:'$addresses.state',
            pin:'$addresses.pin',
            addressId:'$addresses._id',
            _id:0
        }}])
        res.render('./userFiles/checkOutPage',{price,cartCount,catData,userData:req.session.userData,addressData})
    },

    deleteAddress:async (req,res)=>{
        try{
            await userCollection.updateOne({_id:req.session.userData._id},{$pull:{addresses:{_id:mongoose.Types.ObjectId(req.query.addressId)}}})
            res.json({status:true})
        }
        catch(err){
            res.render('./404Error')
        }

    },
    
    addAddress:async (req,res)=>{
        try{
            req.body.pin=parseInt(req.body.pin)
            await userCollection.updateOne({_id:req.session.userData._id},{$push:{addresses:req.body}})
            res.json({status:true})
        }
        catch(err){
            res.render('./404Error')
        }
    },

    couponApply:async (req,res)=>{
        try{
            let coupon=await couponCollection.findOne({couponCode:req.query.couponCode,status:true})
            if(coupon){
                let userData=await userCollection.findOne({_id:req.session.userData._id})
                let couponData=userData.couponsApplied
                let couponExist=couponData.findIndex((item)=>{
                    return item==req.query.couponCode
                })
                if(couponExist==-1){
                    let couponData=await couponCollection.findOne({couponCode:req.query.couponCode})
                    res.json({coupon:'appliedNow',couponData})
                }else{
                    res.json({coupon:'alreadyApplied'})
                }
            }
            else{
                res.json({coupon:'invalid'})
            }
        }
        catch(err){
            res.render('./404Error')
        }

    }
}