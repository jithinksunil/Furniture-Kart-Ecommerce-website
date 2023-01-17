const mongoose=require('mongoose')

/********************Connection setUp of mongoose Driver**************************/ 
function mongodb(){
    mongoose.connect('mongodb+srv://Jithinksunil:Monuttan2652@cluster0.rz3966l.mongodb.net/furniture_kart_database?retryWrites=true&w=majority',{
        useNewUrlParser:true,
        useUnifiedTopology:true
        },(err)=>{
        if(err){
            console.log(err)
        }else{
            console.log('Data Base connected')
        }
    })
}

module.exports=mongodb