let userModel = require("../models/user");

let userService = {
    create: async (data) => {
        await userModel(data).save();
        return;
    },

    findOne: async (query) => {
        let user = await userModel.findOne(query);
        return user;
    },
    findOneAndUpdate: async (query, updateData) => {
        return await userModel.findOneAndUpdate(query, updateData);
    }
};

module.exports = userService;