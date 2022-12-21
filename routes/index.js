var express = require('express');
var router = express.Router();
let passport = require("passport");


let dashboardController = require("../controllers/dashboardController");
let userController = require("../controllers/userController");
let authController = require("../controllers/authController");
let todoController = require("../controllers/todoController");
let { createTodoValidation } = require("../validators/todoValidator");
let { createUserValidation } = require("../validators/userValidator");
let { isLoggedIn } = require("../middleware/authenticateMiddleware");
let { checkPermission } = require("../middleware/permissionMiddleware");


router.get('/register', authController.register);
router.post('/auth/register', [createUserValidation], authController.registerUser);
router.get('/auth/:token/verify', authController.verifyAccount);
router.get('/login', authController.loginPage);
router.post('/auth/login', async (req, res, next) => {
    await passport.authenticate('local', async(err, user, info) => {
        if (!user) {
            let msg = info && info.message ? info.message : 'Incorrect Email/Password';
            req.flash('error_msg', msg);
            return res.redirect('/login');
        }
        return req.logIn(user, async function(err) {
            if (err) { return next(err); }
            return res.redirect('/dashboard');
        });
    })(req, res, next);
});
router.get('/logout', authController.logout);


router.get('/profile', [isLoggedIn], userController.profile);
router.get('/profile/edit', [isLoggedIn], userController.editProfile);
router.post('/profile/update', [isLoggedIn], userController.updateProfile);

/* GET home page. */
router.get('/', [isLoggedIn], (req, res) => {
    return res.redirect("/dashboard");
});
router.get('/dashboard', [isLoggedIn], dashboardController.index);

/* GET home page. */
router.get('/todos', [isLoggedIn, checkPermission('todos.view')], todoController.findAllTodos);

// Create todo
router.post("/todos", [isLoggedIn, checkPermission('todos.create'), createTodoValidation], todoController.createTodo);

// show edit page
router.get('/todos/:id', [isLoggedIn, checkPermission('todos.edit')], todoController.todoDetails);

// update single todo
router.put('/todos/:id', [isLoggedIn, checkPermission('todos.edit')], [createTodoValidation], todoController.updateTodo);

// Delete single todo item
router.delete('/todos/:id', [isLoggedIn], todoController.deleteTodo);


router.get("/403", (req, res, next) => {
    return res.render("error/403");
});

module.exports = router;