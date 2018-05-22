//const MongoClient = require('mongodb').MongoClient;

const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('unable to connect to mongo database');
    }

    console.log('connection established with mongodB');

    const db = client.db('TodoApp')

    //deleteMany

   // db.collection('Todos').deleteMany({text:'battle royal is ongoing trend today'}).then((result)=>{
     //   console.log(result);
    //})

    //deleteOne

    // db.collection('Todos').deleteOne({text:'battle royal is ongoing trend today'}).then((result)=>{
    //      console.log(result);
    //    });

    //findOneAndDelete

   /// db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
      //  console.log(result);
   // })

    /*  db.collection('Users').deleteMany({name:'Manav Bajaj'}).then((result)=>{
          console.log(result);
      })*/

      db.collection('Users').findOneAndDelete({_id: new ObjectID('5b031433bc79f41d7c898fbb')}).then((result)=>{
          console.log(result);
      })
    
   // client.close();
});