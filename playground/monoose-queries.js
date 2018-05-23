const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');

const {User} = require('./../server/models/user.js');

var id  = '6b0529725e41d567b4c060b0';

// if(!ObjectID.isValid(id)){
//    console.log('id not found');
// }

// Todo.find({
//     _id:id
// }).then((todos)=>{
//     console.log('Todos',todos)
// })

// Todo.findOne({
//     _id:id
// }).then((todo)=>{
//     console.log('todo',todo)
// })

// Todo.findById(id).then((todo)=>{
//     if(!todo){
//         return console.log('ID not found');
//     }
//     console.log('todo',todo);
// }).catch((e)=>console.log(e));

User.findById(id).then((user)=>{
    
    if(!user){
       return console.log('user  not found');
    }
    console.log('user',user);
},(e)=>{
    console.log(e)
});
