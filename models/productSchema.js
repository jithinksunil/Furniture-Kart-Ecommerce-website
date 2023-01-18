const mongoose=require('mongoose')

const newSchema=new mongoose.Schema({//defining structure of collections
    productName:String,
    productImage:[{public_id:String,cloudunaryUrl:String}],
    category:String,
    description:String,
    rate:Number,
    stock:Number,
    action:Boolean
})

const productCollection=new mongoose.model('product_collection',newSchema)//creating collection using the defined schema and assign to new Model

module.exports=productCollection