const express=require('express')
const router=express.Router()
const userCollection=require('../models/userSchema')
const userController=require('../controllers/userController')

router.get('/furnitureKart',userController.login)

module.exports=router