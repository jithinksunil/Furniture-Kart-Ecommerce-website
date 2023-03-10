const wishlistCollection=require('../models/wishlistSchema')
const catCollection=require('../models/categorySchema')
const cartCollection=require('../models/cartShema')
const mongoose= require('mongoose')
function toObjectId(arg){return mongoose.Types.ObjectId(arg)}

const userWishlist = async(req,res)=>{
    
    let catData=await catCollection.find({action:true})
    let cartCount=0
        try{
            let userCart=await cartCollection.findOne({userId:req.session.userData._id})
            for(let i=0;i<userCart.products.length;i++){
                cartCount=cartCount+userCart.products[i].quantity
            }
        }
        catch(err){
            console.log(err);
        }

    let userWishlist=await wishlistCollection.aggregate([
        {$match:{userId:toObjectId(req.session.userData._id)}},//to object id defined by me look above
        {
            $lookup:{
                from:'product_collections',
                let:{productList:'$products'},
                pipeline:[
                    {
                        $match:{
                            $expr:{
                                $in:['$_id','$$productList']
                            }
                        }
                    }
                ],
                as:'wishlistProducts'
            }
        }
    ])

    
    if(!userWishlist){
        await wishlistCollection.insertMany([{userId:req.query.userId}])
    }

    res.render('./userFiles/userWishlist',{userWishlist,userData:req.session.userData,cartCount,catData})

}

const userAddToWishlist = async(req,res)=>{
    try{
        let productAlreadyExist
        let userWishlist=await wishlistCollection.findOne({userId:req.session.userData._id})
    
        if(!userWishlist){
            await wishlistCollection.insertMany([{userId:req.session.userData._id}])
            userWishlist=await wishlistCollection.findOne({userId:req.session.userData._id})
        }
    
        let itemIndex=userWishlist.products.findIndex((products)=>{
            return products==req.query.productId
        })
    
        if(itemIndex>-1){//-1 if no item matches
    
            productAlreadyExist=true
        }
        else{
            await wishlistCollection.updateOne({userId:req.session.userData._id},
                {
                    $push:{products:req.query.productId}
                }
            )
        }
        res.json({status:true,productAlreadyExist})
    }
    catch(err){
        res.render('./404Error')
    }

}

const removeFromWishlist = async(req,res)=>{
    try{
        await wishlistCollection.updateOne({userId:req.session.userData._id},{$pull:{products:req.query.productId}})
        res.redirect('/wishlist')
    }
    catch(err){
        res.render('./404Error')
    }
}

module.exports={
    userWishlist,
    userAddToWishlist,
    removeFromWishlist
}