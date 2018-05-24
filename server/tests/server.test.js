const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo}= require('./../models/todo');

const {ObjectID} = require('mongodb');

const todos = [

    {
        _id: new ObjectID(),
        text:'first test todo'
    },
    {      
        _id: new ObjectID(),                             //this is the dummy text because beforeEach deletes every thing
        text:'second test todo'
    }
];

beforeEach((done) => {
    Todo.remove({}).then(() => {
    return Todo.insertMany(todos, (error, docs) => {
        if(error){
            return done(error);
        }
    });
    }).then(() => done());
   });

describe('Post/todos',()=>{
    
    it('should create a new todo',(done)=>{

        var text = 'beautiful sunny day'

        request(app)

        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
          expect(res.body.text).toBe(text);
        })
        
     .end((err,res)=>{
         if(err){
             return done(err);
         }

         Todo.find({text}).then((todos)=>{
             expect(todos.length).toBe(1);
             expect(todos[0].text).toBe(text);
             done();

         }).catch((e)=>done(e));
     });
       
         

    });

    it('should not create todo with invalid body data',(done)=>{

        request(app)
        .post('/todos')
        .send({})
        .expect(400)

        .end((err,res)=>{
            if(err){
                return done(err);
            }

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=>done(e))
        });

    });


});

describe('GET/todos',()=>{
    it('should get all todos',(done)=>{
      request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
          expect(res.body.todos.length).toBe(2);
      })
      .end(done);
    });
});

describe('GET/todos/:id',()=>{
  it('should return return todo doc',(done)=>{
      request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)  //converting object id into string
      .expect(200)  
      .expect((res)=>{
          expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);

  });

  it('should have return 404 when id is not found',(done)=>{
     
    var id = new ObjectID().toHexString();
    
    request(app)
     
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non object ids',(done)=>{
      request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done)
  })
 
});

describe('Delete /todos/:id',()=>{
    it('should have delete a todo',(done)=>{

        var id = todos[0]._id.toHexString();

        request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(id);
        })
         
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            Todo.findById(id).then((todo)=>{
                expect(todo).toNotExist();
                done();
            }).catch((e)=>done(e));
        });
    });

    it('should have return 404 if todo not found',(done)=>{

        var id = new ObjectID().toHexString();
        request(app)
     
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);

    });
    it('should have return 404 if Object id is invalid',(done)=>{
        request(app)
        .delete('/todos/123abc')
        .expect(404)
        .end(done)
    })
})