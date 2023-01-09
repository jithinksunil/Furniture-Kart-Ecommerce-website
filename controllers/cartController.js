const cartCollection=require('../models/cartShema')
const catCollection=require('../models/categorySchema')
const mongoose= require('mongoose')
function toObjectId(arg){return mongoose.Types.ObjectId(arg)}

async function userCart(req,res){

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

    let price=0;
    for(let i=0;i<cartProducts.length;i++){
        price=price+(parseInt(cartProducts[i].nos)*parseInt(cartProducts[i].productDetails[0].rate))
    }
    let deliverCharge=40
    let total=price+deliverCharge
    let bill={
        price,deliverCharge,total
    }
    console.log(cartProducts);

    let userCart=await cartCollection.findOne({userId:req.query.userId})
    if(!userCart){
        await cartCollection.insertMany([{userId:req.query.userId}])
    }

    res.render('./userFiles/userCart',{userCart,cartProducts,userData:req.session.userData,bill,catData,cartCount})
}

async function userAddToCart(req,res){
    console.log('ajax worke');

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
    
    res.json({status:true})
}

async function userAddFromCart(req,res){

    let a=await cartCollection.updateOne({userId:req.session.userData._id, 'products.productId':req.query.productId},
    {
        $inc:{'products.$.quantity':1}
    }

)
    res.redirect('/user/cart')
}

async function userDeductFromCart(req,res){

    let a=await cartCollection.updateOne({userId:req.session.userData._id, 'products.productId':req.query.productId},
    {
        $inc:{'products.$.quantity':-1}
    }

)
    res.redirect('/user/cart')
}

async function removeFromCart(req,res){

    await cartCollection.updateOne({userId:req.session.userData._id},{$pull:{products:{productId:req.query.productId}}})
    res.redirect('/user/cart')
}

module.exports={
    userCart,
    userAddToCart,
    userAddFromCart,
    userDeductFromCart,
    removeFromCart
    
}