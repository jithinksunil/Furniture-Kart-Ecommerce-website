const cartCollection=require('../models/cartShema')
const catCollection=require('../models/categorySchema')
const wishlistCollection=require('../models/wishlistSchema')
const mongoose= require('mongoose')
function toObjectId(arg){return mongoose.Types.ObjectId(arg)}

const userCart = async(req,res)=>{
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

let cartProducts=await cartCollection.aggregate([
    {$match:{userId:toObjectId(req.session.userData._id)}},
    {$unwind:'$products'},
    {$project:{prod:'$products.productId',nos:'$products.quantity'}},
    {
        $lookup:{
            from:'product_collections',
            localField:'prod',
            foreignField:'_id',
            as:'productDetails'
        }
    }
])


let price=0;
for(let i=0;i<cartProducts.length;i++){
    price=price+(parseInt(cartProducts[i].nos)*parseInt(cartProducts[i].productDetails[0].rate))
}
let deliverCharge=40
let total=price+deliverCharge
let bill={
    price,deliverCharge,total
}

let userCart=await cartCollection.findOne({userId:req.query.userId})
if(!userCart){
    await cartCollection.insertMany([{userId:req.query.userId}])
}

res.render('./userFiles/userCart',{userCart,cartProducts,userData:req.session.userData,bill,catData,cartCount})

}

const userAddToCart = async(req,res)=>{
    try{
        
        let productQuantityReachedZero;
        let userCart=await cartCollection.findOne({userId:req.session.userData._id})
    
        if(!userCart){
            await cartCollection.insertMany([{userId:req.session.userData._id}])
            userCart=await cartCollection.findOne({userId:req.session.userData._id})
        }
    
        let itemIndex=userCart.products.findIndex((products)=>{
            return products.productId==req.query.productId
        })
    
        if(itemIndex>-1){//-1 if no item matches
    
            if(req.query.increment==1){
    
                let a=await cartCollection.updateOne({userId:req.session.userData._id, 'products.productId':req.query.productId},
                    {
                        $inc:{'products.$.quantity':1}
                    }
                )
            }
            else if(req.query.increment==-1){
    
                const qtyCheck =await cartCollection.aggregate([{$match:{userId:mongoose.Types.ObjectId(req.session.userData._id)}},
                    {$unwind:"$products"},
                    {$match:{"products.productId":mongoose.Types.ObjectId(req.query.productId)}},
                    {$project:{"products.quantity":1,_id:0}}
                ])
                    
                if(qtyCheck[0].products.quantity>1){
    
                    await cartCollection.updateOne({userId:req.session.userData._id, 'products.productId':req.query.productId},
                        {
                            $inc:{'products.$.quantity':-1}
                        }
                    )
                }
                else{
    
                    await cartCollection.updateOne({userId:req.session.userData._id},{$pull:{products:{productId:req.query.productId}}})
                    productQuantityReachedZero=true
                    
                }
            }
        }
        else{
            await cartCollection.updateOne({userId:req.session.userData._id},
                {
                    $push:{products:{productId:req.query.productId, quantity:1}}
                }
            )
        }
    
        if(req.query.fromWishList=='true'){
    
            await wishlistCollection.updateOne({userId:req.session.userData._id},{$pull:{products:req.query.productId}})
            
        }
    
        res.json({status:true,productQuantityReachedZero})
    }
    catch(err){
        res.render('./404Error')
    }

}

const removeFromCart = async(req,res)=>{
    try{
        await cartCollection.updateOne({userId:req.session.userData._id},{$pull:{products:{productId:req.query.productId}}})
        res.redirect('/cart')
    }
    catch(err){
        res.render('./404Error')
    }
}

module.exports={
    userCart,
    userAddToCart,
    removeFromCart
}