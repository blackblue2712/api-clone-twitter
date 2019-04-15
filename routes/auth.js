
const express = require("express");
const router = express.Router();

const {
    signin,
    signup
} = require("../controllers/auth");

router.get('/test', (req, res) => {
    res.send('Hello world');
})
router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;