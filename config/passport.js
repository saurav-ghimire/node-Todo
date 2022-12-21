let LocalStrategy = require("passport-local");
const BearerStrategy = require('passport-http-bearer').Strategy;
let User = require("../models/user");
let tokenService = require("../services/tokenService")

module.exports = (passport) => {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({ email: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, {message:"User not found"});
                }
                if (!user.verifyPassword(password)) {
                    return done(null, false, {message:"Password does not match"});
                }
                if (user.status=="inactive") {
                    return done(null, false, {message:"Account is not active. Please activate your account first."});
                }
                return done(null, user);
            });
        }
    ));

    passport.use(new BearerStrategy( async(accessToken, done) => {
        let token = await tokenService.findOne({ token: accessToken });
        if (token) {
            if( new Date().getTime() > new Date(token.token_expiry).getTime() ) {
                await tokenService.deleteOne({ token: accessToken });
                return done(null, false, { message: 'Token expired' });
            } else {
                let user = await User.findOne({_id: token.user_id});
                done(null, user, {});
            }
        } else {
            done(null, false, { message: 'Unauthorized' });
        }
    }));
};