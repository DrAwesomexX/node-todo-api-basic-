const _ = require('lodash');

const {ObjectID} = require('mongodb');

const express = require('express');
const bodyParser = require('body-parser');




var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');


var app =  express();

const port = process.env.PORT || 3000;


app.use(bodyParser.json());   // middleware used as third part

app.post('/todos',(req,res)=>{

    var todo = new Todo({
        text:req.body.text
    })

    todo.save().then((doc)=>{
        res.send(doc);
    },(err)=>{
        res.status(400).send(err);
    })
})

app.get('/todos',(req,res)=>{

    Todo.find().then((todos)=>{
        res.send({todos})
    },(err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos/:id',(req,res)=>{
    
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
       return res.status(404).send();
    }

    Todo.findById(id).then((todo)=>{
        //success case  
       
       if(!todo){
      return  res.status(404).send();
       } 

       res.send({todo});
        
    },(e)=>{
        res.status(400).send(e);
    });
});

app.delete('/todos/:id',(req,res)=>{
      var id  = req.params.id;
      if(!ObjectID.isValid(id)){
          return res.status(404).send();
      }
      Todo.findByIdAndRemove(id).then((todo)=>{
          if(!todo){
              return res.status(404).send()
          }

          res.status(200).send({todo});

      },(err)=>{
          res.send.status(404).send();
      });
});

 app.patch('/todos/:id',(req,res)=>{
   
    var id = req.params.id;

   var body = _.pick(req.body,['text','completed'])

   if(!ObjectID.isValid(id)){
       return res.status(404).send();
   }

   if(_.isBoolean(body.completed) && body.completed){

    body.completedAt = new Date().getTime();
          
   }
   else{
       body.completed = null;
       boy.completedAt = null;
   }

   Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
       if(!todo){
           return res.status(404).send();
       }
       res.status(200).send(todo);
   }).catch((e)=>{
       res.status(400).send()
   })

 })

app.listen(port,()=>{
    console.log(`started up at : ${port}`);
});


module.exports = {
    app
}



