const router = require("express").Router();
const passport = require("passport");
const { signup, login, loginSuccess, loginFail, logout } = require("../controllers/authController");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000/";

router.post('/signup', signup); // user signup
router.post('/login', login); // user login
router.get('/login/success', loginSuccess); // user login success
router.get('/login/failed', loginFail); // user login failed
router.get('/logout', logout); // user log out

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: '/login/failed',
}));

module.exports = router;