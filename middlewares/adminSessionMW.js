
function adminSession(req,res,next){
    if(true/*req.session.admin*/){
        next()
    }
    else{
        res.redirect('/admin/login')
    }
}

function withOutAdminSession(req,res,next){
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