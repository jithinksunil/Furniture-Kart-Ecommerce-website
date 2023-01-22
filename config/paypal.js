let paypal = require('paypal-rest-sdk')
const dotenv = require("dotenv")
dotenv.config()//will convert the .env file into an object

module.exports={
    paypalIntergration:(res,userId,totalAmount)=>{
        paypal.configure({
            'mode': 'sandbox',
            'client_id': 'AUph16OQlgs0Af8jR_YZyxgY88VLPyPVk_qU_MJUZ1O0b9y4VZ0Zxb7wFcxDd3n5YufGHhRTbSuFytNW',
            'client_secret': 'EASmta6JXHlT5rtXDeE4ki62L0Oz0ayFW8ztvJR6Qbq5xk-67d6Q7-Af0mvcN-HkDiGhPby3ljgnB377'
          });
        
          const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${process.env.MY_DOMAIN_IN_PAYPAL}/order/onlinepayment/success`,
                "cancel_url": `${process.env.MY_DOMAIN_IN_PAYPAL}/order/onlinepayment/cancel`
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": `${userId}`,
                        "sku": "item",
                        "price": totalAmount,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total":totalAmount
                },
                "description": "This is the payment description."
            }]
        };
        
        paypal.payment.create(create_payment_json, async function (error, payment) {
            if (error) {
              throw error;
            } else {
              for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                    res.redirect(payment.links[i].href)
                }
            }
          }
        });
    },
    succesCase:(req,res)=>{
        const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId
    const execute_payment_json = {
        payer_id: payerId,
        transactions: [
            {
                amount: {
                    currency: "USD",
                    "total": `${req.session.onlinePaymentOrder.netAmount}`
                }
            }
        ]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.redirect('/order/completed')
        }
    });
    }
}



