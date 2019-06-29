
const express = require("express");
const router = express.Router();

const {
    signin,
    signup,
    signout,
    requireSignin,
    forgotPassword,
    resetPassword
} = require("../controllers/auth");
const {
    validateSignupUser,
    validatePassword
} = require("../validator");

router.get('/test',requireSignin, (req, res) => {
    console.log("TEST", req.payload)
    res.send('Hello world');
})
router.post('/signup', validateSignupUser, signup);
router.post('/signin', signin);
router.get('/signout', signout);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

module.exports = router;