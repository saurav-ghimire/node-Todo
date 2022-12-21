"use strict";

const _ = require('lodash');

const config = require('../config/cmsConfig');
const modules = config.modules;
const modulePages = config.modulePages;
const modulePermissions = config.modulePermissions;
const moduleIcons = config.moduleIcons;

module.exports = {
    getPermissions : (user) => {
        let permission = [];
        if(user && user.role_id){
            if(user.role_id.name === 'Super Admin'){
                for (let moduleID in modules) {
                    const arrayData = {
                        id: moduleID,
                        title:modules[moduleID],
                        subpagesCount:Object.keys(modulePages[moduleID]).length,
                        enableDropdown: Object.keys(modulePages[moduleID]).length > 1 ? true : false,
                        subPages: modulePages[moduleID],
                        icon: moduleIcons[moduleID]
                    };
                    permission.push(arrayData);
                }
            } else {
                for (let moduleID in modules) {
                    if(moduleID === 'dashboard') {
                        const arrayData = {
                            id: moduleID,
                            title:modules[moduleID],
                            subpagesCount:Object.keys(modulePages[moduleID]).length,
                            enableDropdown: Object.keys(modulePages[moduleID]).length > 1 ? true : false,
                            subPages: modulePages[moduleID],
                            icon: moduleIcons[moduleID]
                        };
                        permission.push(arrayData);
                    } else {
                        if(modulePermissions[moduleID] !== undefined) {
                            const userPermission = user.role_id.permissions;
                            let modulePermissionData = _.map(modulePermissions[moduleID], function(p,key) {
                                if(_.includes(userPermission, key)){
                                    return key;
                                }
                            });
                            modulePermissionData = _.filter(modulePermissionData,function(p){
                                return p!== undefined;
                            });
                            if(modulePermissionData.length > 0 && modulePermissionData!== undefined){
                                let submoduleArray = {};
                                _.map(modulePages[moduleID], function(p,key) {
                                    let submodulePermissionInsideData = _.filter(modulePermissionData,function(o){
                                        return (o.indexOf(key) >= 0);
                                    });
                                    if(submodulePermissionInsideData.length > 0) {
                                        submoduleArray[key] = p;
                                    }
                                });
                                const arrayData = {
                                    id: moduleID,
                                    title:modules[moduleID],
                                    subpagesCount:Object.keys(modulePages[moduleID]).length,
                                    enableDropdown: Object.keys(modulePages[moduleID]).length > 1 ? true : false,
                                    subPages: submoduleArray,
                                    icon: moduleIcons[moduleID]
                                };
                                permission.push(arrayData);
                            }
                        }
                    }
                }
            }
        }
        return permission;
    }
};