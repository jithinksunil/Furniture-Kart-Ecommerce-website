const cartCollection=require('../models/cartShema')

async function userCart(req,res){
    let userCart=await cartCollection.findOne({userId:req.query.userId})

    if(!userCart){
        await cartCollection.insertMany([{userId:req.query.userId}])

    }
    console.log(userCart);

    res.render('./userFiles/userCart',{userCart:userCart,userData:req.session.userData})
}

async function userAddToCart(req,res){
    
    await cartCollection.updateOne({userId:req.session.userData._id},
        {
            $push:{products:req.query.productId}
        }
    )
    res.redirect('/')
}

module.exports={
    userCart,
    userAddToCart
}