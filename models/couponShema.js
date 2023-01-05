const mongoose=require('mongoose')

const newSchema=new mongoose.Schema({//defining structure of collections
    couponCode:{type:String,default:'General coupon'},
    status:{type:Boolean, default:true},
    discount:Number,
    count:Number
})

const couponCollection=new mongoose.model('coupon_collection',newSchema)//creating collection using the defined schema and assign to new Model

module.exports=couponCollection