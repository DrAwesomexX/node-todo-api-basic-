//const MongoClient = require('mongodb').MongoClient;

const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('unable to connect to mongo database');
    }

    console.log('connection established with mongodB');

    const db = client.db('TodoApp')


    // db.collection('Todos').find({_id: new ObjectID('5b0312aabda7a91284df96c8')}).toArray().then((docs)=>{

    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2));

    // },(err)=>{
    //     console.log('unable to fetch todos',err);
    // })

    //  db.collection('Users').find().count().then((count)=>{

    //     console.log(`Users count : ${count}`)

    //  },(err)=>{
    //      console.log('unable to count Todos',err);
    //  })


    db.collection('Users').find({name:'Manav Bajaj'}).toArray().then((docs)=>{

        console.log('Users');
        console.log(JSON.stringify(docs,undefined,2));

        return  db.collection('Users').find({name:'Manav Bajaj'}).count()

    },(err)=>{
        console.log('unable to find user name in Users',err)
    }).then((count)=>{
        console.log(`Users count : ${count}`);
    },(err)=>{
        console.log('unable to count user name in Users',err)
    })

   // client.close();
});