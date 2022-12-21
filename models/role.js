const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let roleSchema = new Schema({
   'name': { type: String, required: true },
   'status': { type: String, required: true},
   'permissions': {type: Array },
   // 'slug': { type: String, required: true },
   'created_at': { type: Date, default: Date.now },
   'updated_at': { type: Date, default: Date.now }
});
module.exports = mongoose.model('Role', roleSchema);