let randtoken = require('rand-token');
let passport = require('passport');
const { validationResult } = require('express-validator');

let userService = require("../../services/userService");
let roleService = require("../../services/roleService");
let tokenService = require("../../services/tokenService");
let { sendMail } = require("../../services/emailService");

let authController = {
    registerUser: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(422).send(errors.array());
        }
        try {
            let userData = req.body;

            let token = randtoken.generate(10);
            userData.token = token;
            userData.tokenExpiry = new Date().getTime() + (1*60*60*1000);
            let role = await roleService.findOne({name: "Normal User"});
            userData.role_id = role._id;
            await userService.create(userData);

            let emailDetails = {
                to: userData.email,
                subject: "Activate account",
                html: "Dear "+userData.first_name+",<br>Your account is created in our application. Your token to activate your account is: <br>"+token+"<br><br>Thank you."
            };
            await sendMail(emailDetails);

            return res.json({"message": "User created successsfully. Please check your email for token"});
        } catch (error) {
            next(error);
        }
    },

    activateUser: async(req, res, next) => {
        try {
            let token = req.params.token;

            let user = await userService.findOne({token: token});
            if(!user) {
                return res.status(400).send({"message": "Token is invalid"});
            }
            if(user.tokenExpiry < new Date()) {
                return res.status(400).send({"message": "Token is expired"});
            }
            let updateData = {
                status: "active",
                token: "",
                tokenExpiry: null
            }
            await userService.findOneAndUpdate({_id: user._id}, updateData);

            return res.status(200).send({"message": "Your account is activated. Please login to continue."});
        } catch (error) {

        }
    },
    loginUser: async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(422).send(errors.array());
        }
        await passport.authenticate('local', async(err, user, info) => {
            console.log(info);
            if (err) {
                return res.status(500).json({status: "error", message: err.message, error: err});
            }
            if (info && info.message) {
                return res.status(400).json({status: "error", message: info.message});
            }
            if (user) {
                let token = randtoken.generate(250);
                let refreshToken = randtoken.generate(250);
                let expiryDate =  new Date().getTime() + (1*60*60*1000);
                let tokenData = {
                    'token': token,
                    'token_expiry': new Date(expiryDate),
                    'refresh_token': refreshToken,
                    'refresh_token_expiry': new Date(expiryDate),
                    'user_id': user._id
                };
                let tokenDetails = await tokenService.create(tokenData);

                return res.status(200).json({status: "success", data: {
                    'access_token': tokenDetails.token,
                    'refresh_token': tokenDetails.refresh_token,
                    'expires_in': expiryDate,
                    'type': "Bearer"
                }
                });
            }
        })(req, res);
    },
};


module.exports = authController;