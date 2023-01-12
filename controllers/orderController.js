const { model } = require("mongoose")
const orderCollection = require("../models/orderSchema")
const cartCollection=require('../models/cartShema')
const currentDate=require('../config/currentDate')
var paypal = require('paypal-rest-sdk')
paypalFunction=require('../config/paypal')


module.exports={
    order:async (req,res)=>{

        let cartData=await cartCollection.findOne({userId:req.session.userData._id})

        if(req.body.paymentMethod=='COD'){

            await orderCollection.insertMany([{
                userId:req.session.userData._id,
                products:cartData.products,
                coupondApplied:'FR01JON23',
                netAmount:req.query.netAmount,
                address:req.body,
                paymentMethod:req.body.paymentMethod,
                orderDate: currentDate(),
                orderMonth:parseInt(currentDate().split('/')[1])
            }])
            await cartCollection.deleteOne({userId:req.session.userData._id})
            res.redirect('/oder/completed')
        }
        else if(req.body.paymentMethod=='Online'){
            req.session.onlinePaymentOrder={
                userId:req.session.userData._id,
                products:cartData.products,
                coupondApplied:'FR01JON23',
                netAmount:req.query.netAmount,
                address:req.body,
                paymentMethod:req.body.paymentMethod,
                orderDate: currentDate(),
                orderMonth:parseInt(currentDate().split('/')[1])
            }
            res.redirect('/onlinepayment/gateway')
        }
        
    },
    orderCompleted:(req,res)=>{
        res.render('./userFiles/userOrderCompletedPage')
    },
     
    onlinePaymentGateWay:(req,res)=>{
        paypalFunction.paypalIntergration(res,req.session.userData._id,req.session.onlinePaymentOrder.netAmount)
    },
    onlinePaymentSuccess:async (req,res)=>{

        
        await orderCollection.insertMany([req.session.onlinePaymentOrder])
        await cartCollection.deleteOne({userId:req.session.userData._id})
        paypalFunction.succesCase(req,res)

    },
    onlinePaymentCancel:(req,res)=>{
        res.send('cancelled')
    }
}


