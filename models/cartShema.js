const mongoose=require('mongoose')

const newSchema=new mongoose.Schema({//defining structure of collections
    userId:String,
    products:[String]
})

const cartCollection=new mongoose.model('cart_collection',newSchema)//creating collection using the defined schema and assign to new Model

module.exports=cartCollection