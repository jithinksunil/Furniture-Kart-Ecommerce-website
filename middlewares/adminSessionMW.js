const userCollection = require("../models/userSchema")

function adminSession(req,res,next){
    if(req.session.admin){
        next()
    }
    else{
        res.redirect('/admin/login')
    }
}

async function withOutAdminSession(req,res,next){
    if(!req.session.admin){
        
        next()
       
    }
    else{
        res.redirect('/admin/dashboard')
    }
}
module.exports={ 
    adminSession,
    withOutAdminSession
}