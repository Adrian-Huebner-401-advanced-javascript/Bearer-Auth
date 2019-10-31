'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'mysecret';
const TOKEN_EXPIRES = process.env.TOKEN_LIFETIME || null;

// wiping token from database anytime user uses token, optionally make a new token for them to use or have them resign back in delete or update operation

const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  email: {type: String},
  role: {type: String, required: true, default:'user', enum: ['admin','editor','user']},
});

users.pre('save', async function() {
  if (this.isModified('password'))
  {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

users.statics.createFromOauth = function(email) {

  if(! email) { return Promise.reject('Validation Error'); }

  return this.findOne( {email} )
    .then(user => {
      if( !user ) { throw new Error('User Not Found'); }
      console.log('Welcome Back', user.username);
      return user;
    })
    .catch( error => {
      console.log('Creating new user');
      let username = email;
      let password = 'none';
      return this.create({username, password, email});
    });

};

users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then( user => user && user.comparePassword(auth.password) )
    .catch(error => {throw error;});
};

users.statics.authenticateToken = function(token){
  let parsedToken = jwt.verify(token, SECRET);
  console.log(parsedToken);
  return this.findOne({_id: parsedToken.id})
};

users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then( valid => valid ? this : null);
};

users.methods.generateToken = function() {
  let verifyOptions = {
    expiresIn: 900
  };
  let token = {
    id: this._id,
    role: this.role,
  };
  return jwt.sign(token, SECRET, verifyOptions);
};

module.exports = mongoose.model('users', users);