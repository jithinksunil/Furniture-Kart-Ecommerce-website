
function adminLogin(req,res){
    res.render('./adminFiles/adminLoginPage')
}

function adminLoginValidation(req,res){
    res.redirect('/admin/dashboard')
}

function adminDashBoard(req,res){
    res.render('./adminFiles/adminDashBoard')
}

function userManagement(req,res){
    res.render('./adminFiles/admin_userManagement')
}

function categoryManagement(req,res){
    res.render('./adminFiles/adminCatagories')
}

function productManagement(req,res){
    res.render('./adminFiles/adminProducts')
}

function orderManagement(req,res){
    res.render('./adminFiles/adminOrderManagement')
}

function couponManagement(req,res){
    res.render('./adminFiles/adminCouponManagement')
}

module.exports={
    adminLogin,
    adminLoginValidation,
    adminDashBoard,
    userManagement,
    categoryManagement,
    productManagement,
    orderManagement,
    couponManagement
}