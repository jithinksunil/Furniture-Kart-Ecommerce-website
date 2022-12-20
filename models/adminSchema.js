const mongoose=require('mongoose')

const newSchema=new mongoose.Schema({//defining structure of collections
    fName:String,
    lName:String,
    email:String,
    password:String,
})

const adminCollection=new mongoose.model('admin_collection',newSchema)//creating collection using the defined schema and assign to new Model

module.exports=adminCollection