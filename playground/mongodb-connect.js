//const MongoClient = require('mongodb').MongoClient;

const {MongoClient,ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('unable to connect to mongo database');
    }

    console.log('connection established with mongodB');

    const db = client.db('TodoApp')


    // db.collection('Todos').insertOne({

    //     text:'something just like this',
    //     completed:false

    // },(err,result)=>{
    //     if(err){
    //         return console.log('unable to insert todo',err)
    //     }

    //     console.log(JSON.stringify(result.ops,undefined,2));
    // })

    /*db.collection('Users').insertOne({
               
        name:'Manav Bajaj',
        location:'Delhi',
        age:20,
        completed:false
 
    },(err,result )=>{
         if(err){
             return console.log('unable to insert users',err)
         }
         console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined,2));
    })*/

    db.collection('Users').insertOne({
        name:'Manav',
        occupation:'student',
        age:20,
        location:'delhi',
        completed:false
    },(err,result)=>{
        if(err){
            return console.log('unable to insert into users',er)
        }
        console.log(JSON.stringify(result.ops,undefined,2));
    })

    //client.close();
});