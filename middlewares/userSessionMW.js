
function userSession(req,res,next){
    if(req.session.userData){
        next()
    }
    else{
        res.redirect('/')
    }
}

function withOutUserSession(req,res,next){
    if(!req.session.userData){
        next()
    }
    else{
        res.redirect('/')
    }
}
module.exports={ 
    userSession,
    withOutUserSession
}