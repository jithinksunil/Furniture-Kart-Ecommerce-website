const mongoose=require('mongoose')
const dotenv = require("dotenv")
dotenv.config()//will convert the .env file into an object
/********************Connection setUp of mongoose Driver**************************/ 
function mongodb(){
    mongoose.set('strictQuery', true)//to supress the warning from console while connecting ,we can delete this line of code
    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
        },(err)=>{
        if(err){
            console.log("Data base couldn't connect")
        }else{
            console.log('Data Base connected')
        }
    })
}

module.exports=mongodb