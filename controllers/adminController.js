
function adminLogin(req,res){
    res.render('./adminFiles/adminLoginPage')
}

function adminLoginValidation(req,res){
    res.redirect('/admin/profile')
}

function adminProfile(req,res){
    res.render('./adminFiles/adminProfilePage')
}

module.exports={
    adminLogin,
    adminLoginValidation,
    adminProfile
}