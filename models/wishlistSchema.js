const mongoose=require('mongoose')

const newSchema=new mongoose.Schema({//defining structure of collections
    userId:mongoose.Types.ObjectId,
    products:[mongoose.Types.ObjectId]
})

const wishlistCollection=new mongoose.model('wishlist_collection',newSchema)//creating collection using the defined schema and assign to new Model

module.exports=wishlistCollection