let config = {};
config.modules = {
    "dashboard": "Dashboard",
    "roles": "Roles",
    "admins": "Admins",
    "users": "Users",
    "todos": "Todos"
};
config.modulePages = {
    "dashboard": {
        "dashboard": "Dashboard"
    },
    "roles": {
        "roles": "Roles"
    },
    "admins": {
        "admins": "Admins"
    },
    "users": {
        "users": "Users"
    },
    "todos": {
        "todos": "Todos"
    }
};

config.modulePermissions = {
    "roles": {
        "roles.view": "View Roles",
        "roles.create": "Create Roles",
        "roles.edit": "Edit Roles",
        "roles.delete": "Delete Roles"
    },
    "admins": {
        "admins.view": "View Admins",
        "admins.create": "Create Admins",
        "admins.edit": "Edit Admins",
        "admins.delete": "Delete Admins"
    },
    "users": {
        "users.view": "View Users",
        "users.create": "Create Users",
        "users.edit": "Edit Users",
        "users.delete": "Delete Users"
    },
    "todos": {
        "todos.view": "View Todos",
        "todos.create": "Create Todos",
        "todos.edit": "Edit Todos",
        "todos.delete": "Delete Todos"
    }
};
config.moduleIcons = {
    "dashboard": "icon-grid",
    "roles": "icon-grid",
    "admins": "icon-grid",
    "users": "icon-grid",
    "todos": "icon-grid"
};
module.exports = config;