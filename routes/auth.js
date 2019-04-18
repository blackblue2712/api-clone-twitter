
const express = require("express");
const router = express.Router();

const {
    signin,
    signup,
    signout,
    requireSignin
} = require("../controllers/auth");
const {
    validateSignupUser
} = require("../validator");

router.get('/test',requireSignin, (req, res) => {
    console.log("TEST", req.payload)
    res.send('Hello world');
})
router.post('/signup', validateSignupUser, signup);
router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;