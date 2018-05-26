const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo}= require('./../models/todo');
const {User}=  require('./../models/user');

const {ObjectID} = require('mongodb');

const{todos,populateTodos,users,populateUsers} = require('./seed/seed.js');


beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
      var hexId = todos[0]._id.toHexString();
      var text = 'This should be the new text';
  
      request(app)
        .patch(`/todos/${hexId}`)
        .send({
          completed: true,
          text
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(true);
          expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
    });
  
    it('should clear completedAt when todo is not completed', (done) => {
      var hexId = todos[1]._id.toHexString();
      var text = 'This should be the new text!!';
  
      request(app)
        .patch(`/todos/${hexId}`)
        .send({
          completed: false,
          text
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);
    });
  });

  describe('GET/users/me',()=>{

    it('should return user if authenticated',(done)=>{

        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })

        .end(done);
    });

    it('should return 401 if not authenticated',(done)=>{

        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({})
        })

        .end(done);
    })
  });

  describe('POST/users',()=>{
      it('should created a user',(done)=>{
          var email = 'example@mail.com'
          var password = '123vbc'
          request(app)
          .post('/users')
          .send({email,password})
          .expect(200)
          .expect((res)=>{
              expect(res.headers['x-auth']).toExist();
              expect(res.body.email).toBe(email);
              expect(res.body._id).toExist();
            
            
          })
          .end((err)=>{

            if(err){
                return done(err);
            }

            User.findOne({email}).then((user)=>{
                expect(user).toExist()
                expect(user.password).toNotBe(password);
                done();
            }).catch((e)=>done(e));
          });
      });

      it('should return validation errors if request invalid',(done)=>{
            
              var email = 'man';
              var password = '44';

              request(app)
              .post('/users')
              .send({
                  email,
                  password
              })
              .expect(400)
              .end(done);
      })

      it('should not create user if email in use',(done)=>{

        var email ='ajay@example.com';
        var password='123abc'
        request(app)
        .post('/users')
        .send({
            email,
            password
        })
        .expect(400)
        .end(done);

      })
  });

  describe('POST/users/login',()=>{

    it('should login user and return auth token',(done)=>{

        request(app)
        .post('/users/login')
        .expect(200)
        .send({
            email:users[1].email,
            password:users[1].password
        })

        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist();
         })

         .end((err,res)=>{

            if(err){
                return done(err);
            }

              User.findById(users[1]._id).then((user)=>{

                expect(user.tokens[0]).toInclude({
                    access:'auth',
                    token:res.headers['x-auth']
                    
                });
                done();

              }).catch((e)=>done(e));
         });

    });

    it('should return 400 if credentials not matched',(done)=>{
         request(app)
         .post('/users/login')
         .send({
             email:users[1].email,
             password:users[1].password + 1
         })  

        .expect(400)
         .expect((res)=>{
             expect(res.headers['x-auth']).toNotExist();
             
         })

         .end((err,res)=>{
             if(err){
                 return done(err);
             }

             User.findById(users[1]._id).then((user)=>{
                 expect(user.tokens.length).toBe(0);
                 done();
             }).catch((e)=>done(e));


             
         })
    });

  });