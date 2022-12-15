const express=require('express')
const app=express()
const sessions=require('express-session')
const userRouter=require('../The furniture kart/routes/userRoute')
const adminRouter=require('../The furniture kart/routes/adminRoute')

/*---------------------------Setups-----------------------------*/
app.use(express.urlencoded({extended:true}))//to get data from post method

app.use(sessions({//setup session
    resave:true,//to resave the session
    saveUninitialized:true,
    secret:'khfihuifgyscghi6543367567vhbjjfgt45475nvjhgjgj+6+9878', //random hash key string to genarate session id     
}))

app.use((req, res, next) => {//setup cache
    res.set("Cache-Control", "no-store");
    next();
});

app.set('view engine','ejs')//setting up  view engine

const mongodb=require('./config/mongooseConnection')
mongodb()//involked the imported function fron mongooseConnection.

app.listen(3000,()=>console.log('Server started'))

app.use('/',userRouter) //enable the user router
app.use('/',adminRouter)//enable the admin router