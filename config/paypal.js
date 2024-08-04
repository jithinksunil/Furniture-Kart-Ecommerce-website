let paypal = require('paypal-rest-sdk')
const dotenv = require("dotenv")
dotenv.config()//will convert the .env file into an object

module.exports={
    paypalIntergration:(res,userId,totalAmount)=>{
        paypal.configure({
            'mode': 'sandbox',
            'client_id': process.env.PAYPAL_CLIENT_ID,
            'client_secret': process.env.PAYPAL_CLIENT_SECRET
          });
        
          const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${process.env.FRONT_END_URL}/order/onlinepayment/success`,
                "cancel_url": `${process.env.FRONT_END_URL}/order/onlinepayment/cancel`
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



