exports.isLoggedIn = async (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error_msg', 'You have been logged out.');
        return res.redirect('/login');
    }
};