const { model } = require("mongoose")
const orderCollection = require("../models/orderSchema")
const cartCollection=require('../models/cartShema')
const userCollection=require('../models/userSchema')
const currentDate=require('../config/currentDate')
let paypal = require('paypal-rest-sdk')
paypalFunction=require('../config/paypal')

module.exports={
    order:async (req,res)=>{
        try{
            let cartData=await cartCollection.findOne({userId:req.session.userData._id})
            
            if(req.body.paymentMethod=='COD'){
                
                await userCollection.updateOne({_id:req.session.userData._id},{$push:{couponsApplied:req.body.appliedCouponCode}})
                
                await orderCollection.insertMany([{
                    userId:req.session.userData._id,
                    products:req.session.orderProducts,
                    netAmount:parseInt(req.body.netAmount),
                    couponApplied:req.body.appliedCouponCode,
                    address:req.body,
                    paymentMethod:req.body.paymentMethod,
                    orderDate: currentDate(),
                    orderMonth:parseInt(currentDate().split('/')[1])
                }])
                await cartCollection.deleteOne({userId:req.session.userData._id})//bug delete even if purchase by buy now
                req.session.orderProducts=null
                res.redirect('/order/completed')
            }
            else if(req.body.paymentMethod=='Online'){
                req.session.onlinePaymentOrder={
                    userId:req.session.userData._id,
                    products:req.session.orderProducts,
                    netAmount:parseInt(req.body.netAmount),
                    couponApplied:req.body.appliedCouponCode,
                    address:req.body,
                    paymentMethod:req.body.paymentMethod,
                    orderDate: currentDate(),
                    orderMonth:parseInt(currentDate().split('/')[1])
                }
                res.redirect('/order/onlinepayment/gateway')
            }
        }
        catch(err){
            console.log(err);
            res.render('./404Error')
        }

        
    },
    orderCompleted:(req,res)=>{
        try{
            res.render('./userFiles/paymentSuccessPage')
        }
        catch(err){
            res.render('./404Error')
        }
    },
     
    onlinePaymentGateWay:(req,res)=>{
        try{
            paypalFunction.paypalIntergration(res,req.session.userData._id,req.session.onlinePaymentOrder.netAmount)
        }
        catch(err){
            res.render('./404Error')
        }
    },
    onlinePaymentSuccess:async (req,res)=>{
        try{
            await userCollection.updateOne({_id:req.session.userData._id},{$push:{couponsApplied:req.body.appliedCouponCode}})
            await orderCollection.insertMany([req.session.onlinePaymentOrder])
            await cartCollection.deleteOne({userId:req.session.userData._id})//bug delete even if purchase by buy now
            req.session.orderProducts=null
            paypalFunction.succesCase(req,res)
        }
        catch(err){
            res.render('./404Error')
        }


    },
    onlinePaymentCancel:(req,res)=>{
        try{
            res.render('./userFiles/paymentFailedPage')
        }
        catch(err){
            res.render('./404Error')
        }
    }
}


