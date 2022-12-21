let roleModel = require("../models/role");
let permissionModel = require("../models/permission");

let roleService = {
    create: async (data) => {
        let role = await roleModel(data).save();
        return role;
    },
    findAll: async (query) => {
        let roles = await roleModel.find(query);
        return roles;
    },
    findPermissions: async() => {
        let permissions = await permissionModel.find({}).sort({ slug: 'descending' });
        return permissions;
    },
    findOne: async (query) => {
        let role = await roleModel.findOne(query);
        return role;
    },
    findOneAndUpdate: async (query, updateData) => {
        return await roleModel.findOneAndUpdate(query, updateData);
    },
    deleteOne: async (query) => {
        return await roleModel.deleteOne(query);
    }
};

module.exports = roleService;