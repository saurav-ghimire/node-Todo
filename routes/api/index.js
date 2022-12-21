var express = require('express');
var router = express.Router();
var passport = require('passport');

let todoService = require("../../services/todoService");
let authController = require("../../controllers/api/authController");
let { createUserValidation } = require("../../validators/userValidator");

router.post('/register', [createUserValidation], authController.registerUser);
router.get('/:token/activate', authController.activateUser);
router.post('/login', authController.loginUser);


router.get('/test', (req, res, next) => {
    return res.json({data: "This is custom data", message: "This is message"});
});

router.get('/test-loggedin', [passport.authenticate('bearer', {session: false})], (req, res) => {
    try {
        return res.json({message: "You are logged in. Welcome"});
    } catch(err) {
        return res.status(500).json({status: 'error', message: "", error: err});
    }
});

router.post('/todos/create', [passport.authenticate('bearer', {session: false})], async(req, res) => {
    try {
        let todoDetails = req.body;
        await todoService.create({title: todoDetails.title, user_id: req.user._id})

        return res.json({"message": "Todo created successfully."});
    } catch(err) {
        return res.status(500).json({status: 'error', message: err.message, error: err});
    }
});

router.get('/todos', [passport.authenticate('bearer', {session: false})], async (req, res) => {
    try {
        let todos = await todoService.findAll({user_id: req.user._id});
        return res.json({data: todos});
    } catch(err) {
        return res.status(500).json({status: 'error', message: "", error: err});
    }
});

router.get('/todos/:id', [passport.authenticate('bearer', {session: false})], async (req, res) => {
    try {
        let todo = await todoService.findOne({_id: req.params.id});
        return res.json({data: todo});
    } catch(err) {
        return res.status(500).json({status: 'error', message: "", error: err});
    }
});

router.post('/todos/:id', [passport.authenticate('bearer', {session: false})], async (req, res) => {
    try {
        let updatedData = req.body;
        await todoService.update({_id: req.params.id}, updatedData);

        return res.json({message: "Todo updated Successfully"});
    } catch(err) {
        return res.status(500).json({status: 'error', message: "", error: err});
    }
});

router.delete('/todos/:id', [passport.authenticate('bearer', {session: false})], async (req, res) => {
    try {
        await todoService.deleteOne({_id: req.params.id});
        return res.json({message: "Todo deleted Successfully"});
    } catch(err) {
        return res.status(500).json({status: 'error', message: "", error: err});
    }
});


module.exports = router;