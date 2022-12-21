const permissionModel = require('../models/permission');
const permissions = require('../config/cmsConfig').modulePermissions;

let permissionSeeder = async() => {
    for (let key in permissions) {
        if(Object.prototype.hasOwnProperty.call(permissions, key)) {
            let permissionmodules = permissions[key];
            for (let moduleKey in permissionmodules) {
                if( Object.prototype.hasOwnProperty.call(permissionmodules, moduleKey) ) {
                    const permissionData = {
                        slug: moduleKey,
                        name: permissionmodules[moduleKey],
                        module: key
                    };
                    let existingPermission = await permissionModel.findOne({slug:permissionData.slug});

                    if(existingPermission === null){
                        const newPermission = new permissionModel(permissionData);
                        await newPermission.save();
                    }
                }
            }
        }
    }
};

module.exports = { permissionSeeder };