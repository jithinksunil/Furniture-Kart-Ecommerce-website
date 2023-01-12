const { default: mongoose } = require('mongoose');
const cartCollection=require('../models/cartShema')
const catCollection=require('../models/categorySchema');
const userCollection = require('../models/userSchema');

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
    
        let price=0;
        for(let i=0;i<cartProducts.length;i++){
            price=price+(parseInt(cartProducts[i].nos)*parseInt(cartProducts[i].productDetails[0].rate))
        }
        let deliverCharge=40
        let total=price+deliverCharge
        let bill={
            price,deliverCharge,total
        }

        res.render('./userFiles/checkOutPage',{price,cartCount,catData,userData:req.session.userData})
    },
    couponApply:async (req,res)=>{
        let userData=await userCollection.findOne({_id:req.session.userData._id})
        let couponData=userData.coupons

        let couponExist=couponData.findIndex((item)=>{
            return item==req.query.couponCode
        })
        if(couonExist==-1){
            res.json({status:true})
        }else{
            res.json({status:false})
        }
    }
}