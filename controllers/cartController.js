const cartCollection=require('../models/cartShema')
const mongoose= require('mongoose')
function toObjectId(arg){return mongoose.Types.ObjectId(arg)}

async function userCart(req,res){

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
        // ,{
        //     $lookup:{
        //         from:'product_collections',
        //         let:{productList:'$products.productId'},
        //         pipeline:[
        //             {
        //                 $match:{
        //                     $expr:{
        //                         $in:['$_id','$$productList']
        //                     }
        //                 }
        //             }
        //         ],
        //         as:'cartProducts'
        //     }
        // }
    ])
    console.log(cartProducts);

    let userCart=await cartCollection.findOne({userId:req.query.userId})
    if(!userCart){
        await cartCollection.insertMany([{userId:req.query.userId}])
    }

    res.render('./userFiles/userCart',{userCart,cartProducts,userData:req.session.userData})
}

async function userAddToCart(req,res){

    let userCart=await cartCollection.findOne({userId:req.session.userData._id})

    if(!userCart){
        await cartCollection.insertMany([{userId:req.session.userData._id}])
        userCart=await cartCollection.findOne({userId:req.session.userData._id})
    }

    let itemIndex=userCart.products.findIndex((products)=>{
        return products.productId==req.query.productId
    })

    if(itemIndex>-1){//-1 if no item matches

        let a=await cartCollection.updateOne({userId:req.session.userData._id, 'products.productId':req.query.productId},
            {
                $inc:{'products.$.quantity':1}
            }
        )
        console.log(a);
    }
    else{
        await cartCollection.updateOne({userId:req.session.userData._id},
            {
                $push:{products:{productId:req.query.productId, quantity:1}}
            }
        )
    }
    
    res.redirect('/')
}

module.exports={
    userCart,
    userAddToCart
}