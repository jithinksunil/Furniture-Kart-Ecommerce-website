const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userSession = require('../middlewares/userSessionMW');
const { withOutUserSession: withOutUserSessionMW, userSession: userSessionMW } =
  userSession;

const {
  home,
  changePassword,
  editAccount,
  forgotPasswordNewPasswordPage,
  forgotPasswordOtpPage,
  forgotPasswordPage,
  forgotPasswordUpdation,
  updateAccount,
  updatePassword,
  userLogin,
  userLogout,
  userProfile,
  userRegistration,
  userRegistrationOtp,
  userRegistrationOtpValidation,
  userValidation,
} = userController;

router.get('/', home);
router.post('/login/validation', userValidation);
router.post('/registration/Otp', userRegistrationOtp);
router.get('/forgotpassword', forgotPasswordPage);
router.post('/forgotpassword/newpassword', forgotPasswordNewPasswordPage);
router.post('/forgotpassword/passwordupdation', forgotPasswordUpdation);
router.post('/registration/otpRecieved', userRegistrationOtpValidation);
router.get('/forgotpassword/otppage', forgotPasswordOtpPage);

router.get('/login', withOutUserSessionMW, userLogin);
router.get('/registration', withOutUserSessionMW, userRegistration);

router.use(userSessionMW);
router.get('/logout', userLogout);
router.get('/profile', userProfile);
router.get('/change/password', changePassword);
router.post('/update/password', updatePassword);
router.get('/edit/account', editAccount);
router.post('/update/account', updateAccount);

module.exports = router;
