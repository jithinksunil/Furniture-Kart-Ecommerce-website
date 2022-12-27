const mongoose=require('mongoose')

const newSchema=new mongoose.Schema({//defining structure of collections
    userId:String,
    products:[{productId:String,quantity:Number}],
    couponsApplied:[{coupenId:String}],
    netAmount:Number,
    addressId:{houseName:String, village:String, pin:Number, state:String, country:String},
    status:{ type:String,default:'processing'},
    orderDate:String,
    expectedDeliveryDate:String
})

const orderCollection=new mongoose.model('order_collection',newSchema)//creating collection using the defined schema and assign to new Model

module.exports=orderCollection