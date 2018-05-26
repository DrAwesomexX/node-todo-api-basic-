const mongoose = require('mongoose');
const validator =  require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
   var userObject = user.toObject(); // user.toObject() is responsible for taking our mongoose variable and converting into regular object where only the property available on the document exist                                 

   return _.pick(userObject,['_id','email']);
}                                                     

UserSchema.methods.generateAuthToken = function(){   // this method is the instance method

    var user = this;   // instance methods are call with the individual items
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();

    user.tokens = user.tokens.concat([{access,token}]);

  return  user.save().then(()=>{                //in this case we are returning a value
      return token;
    })



}
 
UserSchema.statics.findByToken = function(token){       //this method is the model method
      var User = this; // model method called upon whole model in this case User is the model
      var decoded; // decoded is going to store our decoded JWT values.This is going to be the return result from  jwt.verify 

      //jwt.verify function is gonna throw error when anything goes wrong

      try{
       decoded =   jwt.verify(token,'abc123')
      }catch(e){
          //return new Promise((resolve,reject)=>{
              //reject()
         // })
         return Promise.reject();
      }

      return User.findOne({

        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'


      });
};

UserSchema.pre('save',function(next){     //this is mongoose middleware. this is gonna run before the save event
 
    var user = this;   //accessing individual documents

    if(user.isModified('password')){
          bcrypt.genSalt(10,(err,salt)=>{
              bcrypt.hash(user.password,salt,(err,hash)=>{
                  user.password = hash;
                  next();
              });
          });
    }
    else{
        next();
    }

})                         
 
var User = mongoose.model('User',UserSchema);

module.exports = {
    User
}