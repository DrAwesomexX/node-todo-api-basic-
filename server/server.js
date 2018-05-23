var {ObjectID} = require('mongodb');

var express = require('express');
var bodyParser = require('body-parser');




var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');


var app =  express();


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

app.listen(3000,()=>{
    console.log('server started on port 3000');
});

module.exports = {
    app
}



