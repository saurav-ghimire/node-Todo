let todoModel = require("../models/todo");

let findAll = async function(query) {
    let todos = await todoModel.find(query);
    return todos;
};

let findOne = async (query) => {
    let todo = await todoModel.findOne(query);
    return todo;
};

let create = async (data) => {
    await todoModel(data).save();
    return;
};

let update = async (query, data) => {
    let updatedData = await todoModel.findOneAndUpdate(query, data);
    return updatedData;
};

let deleteOne = async (query) => {
    return await todoModel.deleteOne(query);
};

module.exports = {
    findAll,
    findOne,
    create,
    update,
    deleteOne
};