// create admin role
// create admin with admin role

let roleService = require("../services/roleService");
let userService = require("../services/userService");

let roleData = {
    name: "Super Admin",
    status: "active"
};

roleService.findOne({name: 'Super Admin'}).then(role => {
    if(!role) {
        roleService.create(roleData).then(role => {
            console.log("Role created with name: "+role.name);
            let adminUser = {
                first_name: 'Admin',
                last_name: "User",
                email: 'admin@admin.com',
                status: 'active',
                role_id: role._id,
                password: 'Admin@123'
            };
            userService.create(adminUser);
            console.log("Admin created with email: "+adminUser.email);
        });
    }
});