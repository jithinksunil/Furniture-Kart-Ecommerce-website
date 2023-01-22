
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

function userSessionForAjax(req,res,next){
    if(req.session.userData){
        next()
    }
    else{
        res.json({notLoggedIn:true})
    }
}

module.exports={ 
    userSession,
    userSessionForAjax,
    withOutUserSession
}