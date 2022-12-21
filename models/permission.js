const mongoose = require('mongoose');

let permissionSchema   = new mongoose.Schema({
    'name': { type: String, required: true },
    'slug': { type: String, required: true },
    'module': { type: String, required: true },
    'created_at': { type: Date, default: Date.now },
    'updated_at': { type: Date, default: Date.now }
});
module.exports = mongoose.model('Permission', permissionSchema);