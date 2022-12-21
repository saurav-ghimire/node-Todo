const mongoose = require('mongoose');
const { Schema } = mongoose;

const AccessTokenSchema = new Schema({
    'token': String,
    'token_expiry': Date,
    'refresh_token': String,
    'refresh_token_expiry': Date,
    'user_id': {type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('AccessToken', AccessTokenSchema);