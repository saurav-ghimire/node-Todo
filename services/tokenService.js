let tokenModal = require("../models/accessToken");

let findOne = async (query) => {
    let todo = await tokenModal.findOne(query);
    return todo;
};

let create = async (data) => {
    return await tokenModal(data).save();
};

let deleteOne = async (query) => {
    return await tokenModal.deleteOne(query);
};

module.exports = {
    findOne,
    create,
    deleteOne
};