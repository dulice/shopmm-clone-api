const bcrypt = require("bcrypt");
const uuid = require("uuid").v4();
const User = require("../models/UserSchema");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000/";

const signup = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(user) return res.status(403).json({message: "Email already exists"});
        if(req.body.password.length < 5) return res.status(403).json({message: "Password must be at least 6 characters."});
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            id: uuid,
            username: req.body.username,
            email: req.body.email,
            password: hashPassword,
            source: "local",
            isAdmin: req.body.isAdmin || false,
        });
        await newUser.save();
        return res.status(200).json(newUser);
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}

const login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(403).json({message: "Wrong credentials"});
        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        if(!comparePassword) return res.status(403).json({message: "Wrong credentials"});
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}

const loginSuccess = (req, res) => {
    if(req.user) {
        res.status(200).json({
            message: "Logged in successfully",
            success: true,
            user: req.user
        })
    }
}

const loginFail = (req, res) => {
    res.status(403).json({
        message: "Logged in failed",
        success: false,
    })
}

const logout = (req, res) => {
    req.logOut();
    res.redirect(CLIENT_URL);
}

module.exports = { signup, login, loginSuccess, loginFail, logout}