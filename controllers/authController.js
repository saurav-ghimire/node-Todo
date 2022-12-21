const { validationResult } = require('express-validator');
let randtoken = require('rand-token');

let userService = require("../services/userService");
let { sendMail } = require("../services/emailService");

let register = (req, res, next) => {
    return res.render('auth/register');
};

let registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let inputData = req.body;
        req.flash('inputData', inputData);
        req.flash('errors', errors.array());
        return res.redirect('/register');
    }
    try {
        let userData = req.body;
        let token = randtoken.generate(10);
        userData.token = token;
        userData.tokenExpiry = new Date().getTime() + (1*60*60*1000);
        await userService.create(userData);

        let activationLink = "<a href='http://localhost:5000/auth/"+token+"/verify'>Click To Activate</a>";
        let emailDetails = {
            to: userData.email,
            subject: "Activate account",
            html: "Dear "+userData.first_name+",<br>Your account created in our application. Please click below link to activate your account.<br><br>"+activationLink+"<br><br>Thank you."
        };
        await sendMail(emailDetails);

        req.flash("success_msg", "User registered successfully. Please check your email to activate your account.")
        return res.redirect("/register");
    } catch (err) {
        req.flash("error_msg", err.message);
        return res.redirect("/register");
    }
};

let verifyAccount = async(req, res) => {
    let token = req.params.token;

    let user = await userService.findOne({token: token});
    if(!user) {
        req.flash("error_msg", "Token is invalid");
        return res.redirect("/register");
    }
    if(user.tokenExpiry < new Date()) {
        req.flash("error_msg", "Token is expired");
        return res.redirect("/register");
    }
    let updateData = {
        status: "active",
        token: "",
        tokenExpiry: null
    }
    await userService.findOneAndUpdate({_id: user._id}, updateData);

    req.flash("success_msg", "Your account is activated. Please login to continue.");
    return res.redirect("/login");
};

let loginPage = (req, res, next) => {
    return res.render('auth/login');
};

let logout = (req, res) => {
    req.logout();
    req.flash('error_msg', 'You have been logged out.');
    return res.redirect("/login");
};

module.exports = { register, registerUser, verifyAccount, loginPage, logout };