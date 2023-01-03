const wishlistCollection=require('../models/wishlistSchema')
const mongoose= require('mongoose')
function toObjectId(arg){return mongoose.Types.ObjectId(arg)}

async function userWishlist(req,res){

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

    console.log(userWishlist);
    
    if(!userWishlist){
        await wishlistCollection.insertMany([{userId:req.query.userId}])
    }

    res.render('./userFiles/userWishlist',{userWishlist,userData:req.session.userData})
}

async function userAddToWishlist(req,res){

    let userWishlist=await wishlistCollection.findOne({userId:req.session.userData._id})

    if(!userWishlist){
        await wishlistCollection.insertMany([{userId:req.session.userData._id}])
        userWishlist=await wishlistCollection.findOne({userId:req.session.userData._id})
    }

    let itemIndex=userWishlist.products.findIndex((products)=>{
        return products==req.query.productId
    })

    if(itemIndex>-1){//-1 if no item matches

        console.log('product alredy exist');
    }
    else{
        await wishlistCollection.updateOne({userId:req.session.userData._id},
            {
                $push:{products:req.query.productId}
            }
        )
    }
    
    res.redirect('/')
}

async function removeFromWishlist(req,res){

    console.log(req.query.productId);
    await wishlistCollection.updateOne({userId:req.session.userData._id},{$pull:{products:req.query.productId}})
    res.redirect('/user/wishlist')

}

module.exports={
    userWishlist,
    userAddToWishlist,
    removeFromWishlist
}