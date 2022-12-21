const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let todoSchema = new Schema({
   'title': { type: String, required: true },
   'isCompleted': {type: Boolean, default: false},
   'user_id': {type: Schema.Types.ObjectId, required: true },
   'created_at': { type: Date, default: Date.now },
   'updated_at': { type: Date, default: Date.now }
});
module.exports = mongoose.model('Todo', todoSchema);