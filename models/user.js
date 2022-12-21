const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
   'first_name': { type: String, required: true },
   'last_name': { type: String, required: true },
   'email': { type: String, required: true },
   'password': { type: String, required: true},
   'status': {type: String, default: 'inactive'},
   'image': {type: String },
   'role_id': {type: Schema.ObjectId, ref:'Role', required: true },
   'token': {type: String },
   'tokenExpiry': {type: Date },
   'forgetToken': {type: String },
   'forgetTokenExpiry': {type: Date },
   'created_at': { type: Date, default: Date.now },
   'updated_at': { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
   let user = this;
   if (!user.isModified('password')) {return next();}

   user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
   next();
});

userSchema.methods.verifyPassword = function(password) {
   return bcrypt.compareSync(password, this.password);
};

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);