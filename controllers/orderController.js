const { model } = require("mongoose")
const orderCollection = require("../models/orderSchema")
const cartCollection=require('../models/cartShema')
const userCollection=require('../models/userSchema')
const currentDate=require('../config/currentDate')
let paypal = require('paypal-rest-sdk')
paypalFunction=require('../config/paypal')

module.exports={
    order:async (req,res)=>{

        let cartData=await cartCollection.findOne({userId:req.session.userData._id})
        
        if(req.body.paymentMethod=='COD'){
            
            await userCollection.updateOne({_id:req.session.userData._id},{$push:{couponsApplied:req.body.appliedCouponCode}})
            
            await orderCollection.insertMany([{
                userId:req.session.userData._id,
                products:cartData.products,
                netAmount:parseInt(req.body.netAmount),
                couponApplied:req.body.appliedCouponCode,
                address:req.body,
                paymentMethod:req.body.paymentMethod,
                orderDate: currentDate(),
                orderMonth:parseInt(currentDate().split('/')[1])
            }])
            await cartCollection.deleteOne({userId:req.session.userData._id})
            res.redirect('/order/completed')
        }
        else if(req.body.paymentMethod=='Online'){
            req.session.onlinePaymentOrder={
                userId:req.session.userData._id,
                products:cartData.products,
                netAmount:parseInt(req.body.netAmount),
                couponApplied:req.body.appliedCouponCode,
                address:req.body,
                paymentMethod:req.body.paymentMethod,
                orderDate: currentDate(),
                orderMonth:parseInt(currentDate().split('/')[1])
            }
            res.redirect('/order/onlinepayment/gateway')
        }
        
    },
    orderCompleted:(req,res)=>{
        res.render('./userFiles/userOrderCompletedPage')
    },
     
    onlinePaymentGateWay:(req,res)=>{
        paypalFunction.paypalIntergration(res,req.session.userData._id,req.session.onlinePaymentOrder.netAmount)
    },
    onlinePaymentSuccess:async (req,res)=>{

        await userCollection.updateOne({_id:req.session.userData._id},{$push:{couponsApplied:req.body.appliedCouponCode}})
        await orderCollection.insertMany([req.session.onlinePaymentOrder])
        await cartCollection.deleteOne({userId:req.session.userData._id})
        paypalFunction.succesCase(req,res)

    },
    onlinePaymentCancel:(req,res)=>{
        res.send('cancelled')
    }
}


