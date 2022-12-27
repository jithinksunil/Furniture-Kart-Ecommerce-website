const mongoose=require('mongoose')

const newSchema=new mongoose.Schema({//defining structure of collections
    name:{type:String,default:'General coupon'},
    status:{type:String, default:'Valid'},
    amountOff:Number
})

const couponCollection=new mongoose.model('coupon_collection',newSchema)//creating collection using the defined schema and assign to new Model

module.exports=couponCollection