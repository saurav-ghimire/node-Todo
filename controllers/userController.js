let userService = require("../services/userService")
let randtoken = require('rand-token');

let { mkDirByPathSync, removeFile } = require("../helpers/commonHelper");

let userController = {
    profile: async (req, res, next) => {
        let user = await userService.findOne({_id: req.user.id});
        return res.render("profile", {user});
    },
    editProfile: async (req, res, next) => {
        let user = await userService.findOne({_id: req.user.id});
        return res.render("editProfile", {user});
    },
    updateProfile: async (req, res, next) => {
        let user = await userService.findOne({_id: req.user.id});

        let updatedData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        };
        if (req.files) {
            let dir = "public/uploads/";
            mkDirByPathSync(dir); // It will automatically create directory if missing
            let image = req.files.image;
            let imageName = image.name;
            let imageNameSplit = imageName.split(".");
            let updatedName = "";
            let ext;
            for (let i = 0; i < imageNameSplit.length; i++) {
                let name = imageNameSplit[i];
                if (i == (imageNameSplit.length - 1)) {
                    ext = name;
                } else {
                    if (i == 0) {
                        updatedName = name;
                    } else {
                        updatedName = updatedName + "-" + name;
                    }
                }
            }
            imageName = updatedName + "-" + randtoken.generate(5); // concat random string to name
            imageName = imageName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + "." + ext;

            // save image
            image.mv(dir + imageName, function (err) {
                if (err)
                {imageName = '';}
            });

            if (user.image) {
                removeFile(dir + user.image);
            }
            updatedData['image'] = imageName;
        }

        await userService.findOneAndUpdate({_id: req.user.id}, updatedData);
        req.flash('success_msg', "Profile Updated Successfully.");
        return res.redirect("/profile/edit");
    }
};

module.exports = userController;