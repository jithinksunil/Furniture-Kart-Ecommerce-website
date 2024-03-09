const createError = require('http-errors');
const productCollection = require('../models/productSchema');
const catCollection = require('../models/categorySchema');
const cartCollection = require('../models/cartShema');
const userCollection = require('../models/userSchema');
const otpfunctions = require('../config/otpConfiguration');
const bannerCollection = require('../models/bannerSchema');

const home = async (req, res, next) => {
  try {
    let bannerData = await bannerCollection.find({ action: true });
    let catData = await catCollection.find({ action: true });
    let cartCount = 0;

    let userCart = await cartCollection.findOne({
      userId: req.session?.userData?._id,
    });
    if (userCart)
      for (let i = 0; i < userCart.products.length; i++) {
        cartCount = cartCount + userCart.products[i].quantity;
      }
    recProducts = await productCollection.find().limit(4);

    res.render('./userFiles/userHomePage', {
      catData,
      recProducts,
      userData: req.session.userData,
      bannerData,
      cartCount,
    });
  } catch (err) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  //user login page
  try {
    let warning = req.query.warning;
    res.render('./userFiles/userLoginPage', {
      userData: req.session.userData,
      warning,
    });
  } catch (err) {
    next(err);
  }
};

const userValidation = async (req, res, next) => {
  //user login validation
  try {
    let userData = await userCollection.findOne({ email: req.body.email });
    if (userData.password == req.body.password) {
      req.session.userData = userData;
      res.redirect('/');
    } else {
      res.redirect(`/login?warning=${true}`);
    }
  } catch (err) {
    res.redirect(`/login?warning=${true}`);
  }
};

const userLogout = async (req, res, next) => {
  //user login page
  try {
    req.session.destroy();
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

const userRegistration = async (req, res, next) => {
  //user login page
  try {
    let warning = req.query.warning;
    let catData = await catCollection.find({ action: true });
    res.render('./userFiles/userRegistrationPage', {
      userData: req.session.userData,
      warning,
      catData,
    });
  } catch (err) {
    next(err);
  }
};

const userRegistrationOtp = async (req, res, next) => {
  const warning = undefined;
  try {
    let newUser = await userCollection.findOne({ email: req.body.email });
    if (newUser) {
      return res.redirect(`/registration?warning=${true}`);
    }
    req.session.registrationData = {
      fName: req.body.fName,
      lName: req.body.lName,
      age: req.body.age,
      email: req.body.email,
      password: req.body.password,
    };
    let otpgen = otpfunctions.otp();
    console.log(otpgen);
    let mailOptions = otpfunctions.mailObject(req.body.email, otpgen);
    otpfunctions.mailService(mailOptions);
    req.session.registrationData.otp = otpgen;
    req.session.registrationData.expiry = Date.now() + 60000;
    res.render('./userFiles/otp', { warning });
  } catch (err) {
    next(err);
  }
};

const userRegistrationOtpValidation = async (req, res, next) => {
  try {
    let currentTime = Date.now();
    let expiryTime = req.session.registrationData.expiry;
    let otp = req.session.registrationData.otp;

    if (!(currentTime <= expiryTime) || !(otp == req.body.otp))
      return res.render('./userFiles/otp', {
        warning: 'Time expired or Invalid OTP',
      });

    await userCollection.insertMany([
      {
        fName: req.session.registrationData.fName,
        lName: req.session.registrationData.lName,
        age: req.session.registrationData.age,
        email: req.session.registrationData.email,
        password: req.session.registrationData.password,
      },
    ]);
    const userData = await userCollection.findOne({
      email: req.session.registrationData.email,
    });
    req.session.userData = userData;
    req.session.registrationData = null;
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

const forgotPasswordPage = async (req, res, next) => {
  try {
    let warning = req.query.warning;
    res.render('./userFiles/forgotPasswordPage', { warning });
  } catch (err) {
    next(err);
  }
};

const forgotPasswordOtpPage = async (req, res, next) => {
  try {
    let warning = req.query.warning;

    let userEmail = req.query.userEmail;
    let userData = await userCollection.findOne({ email: userEmail });

    if (!userData) return res.redirect(`/forgotpassword?warning=${true}`);
    if (!warning) {
      let otpgen = otpfunctions.otp();
      console.log(otpgen);
      let mailOptions = otpfunctions.mailObject(userEmail, otpgen);
      otpfunctions.mailService(mailOptions);
      req.session.forgotPasswordOtp = otpgen;
      req.session.forgotPasswordOtpExpiry = Date.now() + 60000;
    }
    res.render('./userFiles/forgotPasswordOtp', {
      userEmail,
      warning: req.query.warning,
    });
  } catch (err) {
    next(err);
  }
};

const forgotPasswordNewPasswordPage = async (req, res, next) => {
  try {
    let currentTime = Date.now();
    let expiryTime = req.session.forgotPasswordOtpExpiry;
    let otp = req.session.forgotPasswordOtp;
    let userEmail = req.body.userEmail;

    console.log(currentTime);
    console.log(expiryTime);

    if (!(currentTime <= expiryTime) || !(otp == req.body.otp)) {
      return res.redirect(
        `/forgotpassword/otppage?warning=${true}&userEmail=${userEmail}`
      );
    }
    res.render('./userFiles/forgotPasswordNewPasswordPage', {
      userEmail,
    });
  } catch (err) {
    next(err);
  }
};

const forgotPasswordUpdation = async (req, res, next) => {
  try {
    await userCollection.updateOne(
      { email: req.body.userEmail },
      { password: req.body.password }
    );
    req.session.userData = await userCollection.findOne({
      email: req.body.userEmail,
    });
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

const userProfile = async (req, res, next) => {
  try {
    const userData = await userCollection.findOne({
      _id: req.session.userData._id,
    });
    let catData = await catCollection.find({ action: true });
    let cartCount = 0;
    let userCart = await cartCollection.findOne({
      userId: req.session.userData._id,
    });
    if (userCart)
      for (let i = 0; i < userCart.products.length; i++) {
        cartCount = cartCount + userCart.products[i].quantity;
      }
    res.render('./userFiles/userProfilePage', {
      userData,
      cartCount,
      catData,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const userData = await userCollection.findOne({
      _id: req.session.userData._id,
    });
    let catData = await catCollection.find({ action: true });
    let cartCount = 0;
    let userCart = await cartCollection.findOne({
      userId: req.session.userData._id,
    });
    if (userCart)
      for (let i = 0; i < userCart.products.length; i++) {
        cartCount = cartCount + userCart.products[i].quantity;
      }
    res.render('./userFiles/userChangePasswordPage', {
      userData,
      cartCount,
      catData,
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    await userCollection.updateOne(
      { _id: req.session.userData._id, password: req.body.currentPassword },
      { password: req.body.newPassword }
    );
    res.redirect('/profile');
  } catch (err) {
    next(err);
  }
};

const editAccount = async (req, res, next) => {
  try {
    let userData = await userCollection.findOne({
      _id: req.session.userData._id,
    });
    let catData = await catCollection.find({ action: true });
    let cartCount = 0;
    let userCart = await cartCollection.findOne({
      userId: req.session.userData._id,
    });
    if (userCart)
      for (let i = 0; i < userCart.products.length; i++) {
        cartCount = cartCount + userCart.products[i].quantity;
      }

    res.render('./userFiles/editAccountPage', { userData, cartCount, catData });
  } catch (error) {
    next(error);
  }
};

const updateAccount = async (req, res, next) => {
  try {
    let userData = {
      fName: req.body.fName,
      lName: req.body.lName,
      age: req.body.age,
    };

    await userCollection.updateOne(
      { _id: req.session.userData._id, password: req.body.currentPassword },
      userData
    );
    res.redirect('/profile');
  } catch (err) {
    next(err);
  }
};


module.exports = {
  home,
  userLogin,
  userValidation,
  userLogout,
  userRegistration,
  userRegistrationOtp,
  userRegistrationOtpValidation,
  forgotPasswordPage,
  forgotPasswordNewPasswordPage,
  forgotPasswordOtpPage,
  forgotPasswordUpdation,
  userProfile,
  changePassword,
  updatePassword,
  editAccount,
  updateAccount,
};
