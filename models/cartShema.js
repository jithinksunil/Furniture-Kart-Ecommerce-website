const mongoose=require('mongoose')

const newSchema=new mongoose.Schema({//defining structure of collections
    userId:mongoose.Types.ObjectId,
    products:[{productId:mongoose.Types.ObjectId,quantity:Number}]
})

const cartCollection=new mongoose.model('cart_collection',newSchema)//creating collection using the defined schema and assign to new Model

module.exports=cartCollection