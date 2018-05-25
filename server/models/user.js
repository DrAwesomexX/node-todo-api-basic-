const mongoose = require('mongoose');
const validator =  require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// creating a schema

var UserSchema = new mongoose.Schema({

    
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        unique:true,
        vaildate:{
            validator:validator.isEmail,
            message:'{value} is not a valid email'
        }
       

     },
     password:{
         type:String,
         required:true,
         minlength:6
     },
     tokens:[{
         access:{
             type:String,
             required:true
         },
         token:{
             type:String,
             required:true
         }

     }]

});

UserSchema.methods.toJSON = function() {                 // this method is responsible for what data is actually go back to user
   var user = this;
   var userObject = user.toObject(); // user.toObject() is responsible for taking our mongoose variable and converting into regular objecy where only the property available on the document exist                                 

   return _.pick(userObject,['_id','email']);
}                                                     

UserSchema.methods.generateAuthToken = function(){

    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();

    user.tokens = user.tokens.concat([{access,token}]);

  return  user.save().then(()=>{                //in this case we are returning a value
      return token;
    })



}
var User = mongoose.model('User',UserSchema);

module.exports = {
    User
}