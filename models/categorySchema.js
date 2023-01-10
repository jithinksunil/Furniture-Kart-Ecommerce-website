const mongoose=require('mongoose')

const newSchema=new mongoose.Schema({//defining structure of collections
    catName:String,
    catImage:[String],
    action:{type:Boolean, default:true}
})

const catCollection=new mongoose.model('category_collection',newSchema)//creating collection using the defined schema and assign to new Model

module.exports=catCollection