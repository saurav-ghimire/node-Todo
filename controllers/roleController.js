const { validationResult } = require('express-validator');
const { groupBy, isEmpty } = require('lodash');
let roleService = require("../services/roleService");
const modules = require('../config/cmsConfig').modules;

let roleController = {};

roleController.index = async (req, res, next) => {
    let roles = await roleService.findAll({});
    return res.render('role/index', { data: roles });
}

roleController.add = async(req, res, next) => {
    const permissions = await roleService.findPermissions();
    const permission = groupBy(permissions, 'module');
    let allPermissions = {};
    for (let key in modules){
        if(Object.prototype.hasOwnProperty.call(modules, key) && Object.prototype.hasOwnProperty.call(permission, key)){
            allPermissions[key] = permission[key];
        }
    }

    return res.render('role/add', {permissions: allPermissions});
}

roleController.addRole = async (req, res, next) => {
    try {
        let role = await roleService.create(req.body);
        req.flash('success_msg', 'Role created Successfully');
        return res.redirect("/roles");
    } catch (err) {
        next(err);
    }

}

roleController.edit = (req, res, next) => {

}

roleController.editRole = (req, res, next) => {

}

roleController.deleteRole = (req, res, next) => {

}

module.exports = roleController;