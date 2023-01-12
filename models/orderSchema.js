const mongoose=require('mongoose')

const newSchema=new mongoose.Schema({//defining structure of collections
    userId:mongoose.Types.ObjectId,
    products:[{productId:mongoose.Types.ObjectId,quantity:Number}],
    couponsApplied:String,
    netAmount:Number,
    address:{houseName:String, area:String, landmark:String, city:String, state:String, pin:Number,ckeckbox:{type:String,default:'Temporary address'},paymentMethod:String},
    paymentMethod:String,
    status:{ type:String,default:'Pending'},
    orderDate:String,
    orderMonth:Number
})

const orderCollection=new mongoose.model('order_collection',newSchema)//creating collection using the defined schema and assign to new Model

module.exports=orderCollection