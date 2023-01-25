const mongoose=require('mongoose')

const newSchema=new mongoose.Schema({//defining structure of collections
    bannerName:String,
    bannerImage:{public_id:String,cloudunaryUrl:String},
    action:{type:Boolean,default:true}
})

const bannerCollection=new mongoose.model('banner_collection',newSchema)//creating collection using the defined schema and assign to new Model

module.exports=bannerCollection