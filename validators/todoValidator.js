const { checkSchema } = require('express-validator');

let createTodoValidation = checkSchema({
    'title': {
        isLength: {
            errorMessage: 'Title is required',
            options: { min: 1 }
        }
    }
});

module.exports = { createTodoValidation };