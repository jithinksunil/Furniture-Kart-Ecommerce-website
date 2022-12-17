
function home(req,res){  //user login page
    res.render('./userFiles/homePage')
}

function userLogin(req,res){  //user login page
    res.render('./userFiles/userLoginPage')
}

function userValidation(req,res){  //user login validation
    let email="jithin@gmail.com"
    let password="1"
    if(email==req.body.email&&password==req.body.password){
        res.redirect('/')
    }
}

function userLogout(req,res){  //user login page
    res.redirect('/')
}

function userRegistration(req,res){  //user login page
    res.render('./userFiles/userRegistrationPage')
}

function userRegistrationValidation(req,res){  //user login page
    res.redirect('/')
}

module.exports={
    home,
    userLogin,
    userValidation,
    userLogout,
    userRegistration,
    userRegistrationValidation

}