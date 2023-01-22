const express=require('express')
const app=express()

const userRouter=require('./routes/userRoute')
const productRouter=require('./routes/productRoute')
const cartRouter=require('./routes/cartRoute')
const checkOutRouter=require('./routes/checkOutRoute')
const wishListRouter=require('./routes/wishlistRoute')
const orderRouter=require('./routes/orderRoute')
const adminRouter=require('./routes/adminRoute')

const dotenv = require("dotenv")
dotenv.config()//will convert the .env file into an object

/*---------------------------Setups-----------------------------*/
app.use(express.urlencoded({extended:true}))//to get data from post method

const sessions=require('express-session')
app.use(sessions({//setup session
    resave:true,//to resave the session
    saveUninitialized:true,
    secret:'khfihuifgyscghi6543367567vhbjjfgt45475nvjhgjgj+6+9878', //random hash key string to genarate session id    
}))
app.use((req, res, next) => {//setup cache
    res.set("Cache-Control", "no-store");
    next();
});

const morgan=require('morgan')//to check weather css are loaded or not
app.use(morgan("dev"))

const path=require('path')
const expressLayouts=require('express-ejs-layouts')
app.use('/public',express.static(path.join(__dirname,'./public')))//static file setup for salesrepor download only?????????
app.use(express.static('./public'));//static file setup for folders in public folder,jithin is a folder inside the public folder
app.use(expressLayouts)//setting up layout
app.set('views','./views')//setting up directory for view engine, here views is the folder
app.set('view engine','ejs')//setting up  view engine

const mongodb=require('./config/mongooseConnection')
mongodb()//involked the imported function from mongooseConnection.

app.use('/',userRouter) //enable the user router
app.use('/product',productRouter)
app.use('/cart',cartRouter)
app.use('/checkout',checkOutRouter)
app.use('/wishlist',wishListRouter)
app.use('/order',orderRouter)
app.use('/admin',adminRouter)//enable the admin router

app.listen(process.env.PORT,()=>console.log('Server started'))