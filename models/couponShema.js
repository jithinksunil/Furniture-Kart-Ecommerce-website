const mongoose=require('mongoose')

const newSchema=new mongoose.Schema({//defining structure of collections
    couponName:{type:String,default:'General coupon'},
    couponCode:String,
    status:{type:Boolean, default:true},
    duductionInPercentage:Number
})

const couponCollection=new mongoose.model('coupon_collection',newSchema)//creating collection using the defined schema and assign to new Model

module.exports=couponCollection