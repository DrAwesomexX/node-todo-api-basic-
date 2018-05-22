//const MongoClient = require('mongodb').MongoClient;

const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('unable to connect to mongo database');
    }

    console.log('connection established with mongodB');

    const db = client.db('TodoApp')


   /* db.collection('Todos').findOneAndUpdate({
        _id:new ObjectID('5b041f12a5716d064421ef68')
    },
    {
        $set:{
            text:'i love battle royale games'
        }
    },
    {
        returnOriginal:false
    }
).then((result)=>{
    console.log(result);
})*/

  db.collection('Users').findOneAndUpdate({
      _id: new ObjectID('5b042fba43ecce6524d2a826')
  },
  {
      $set:{
          name:'Riya'
      },
      $inc:{
          age:1
      }
  },
  {
       returnOriginal:false
  }
).then((result)=>{
    console.log(result)
})

   // client.close();
});