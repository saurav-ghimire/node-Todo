

let checkPermission = (permissionKey) => {
    return function (req, res, next) {
        if(req.user){
            console.log(req.user.role_id);
            if(req.user.role_id.name === 'Super Admin'){
                return next();
            } else  {
                let permissions = req.user.role_id.permissions;
                if(permissions.indexOf(permissionKey)!==-1) {
                    return next();
                } else {
                    return res.redirect("/403");
                }
            }
        }
        return res.redirect("/403");
    };

};

module.exports = { checkPermission };