const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [

    {
     _id: userOneId,
     email:'ajay@example.com',
     password:'userOnePass',
     tokens:[{
         access:userOneId,
         token:jwt.sign({_id:userOneId,access:'auth'},'abc123').toString()
     }]

    },

    {
        _id:userTwoId,
        email:'sneha@example.com',
        password:'userTwoPass'

    }
]
 

const todos = [

    {
        _id: new ObjectID(),
        text:'first test todo'
    },
    {      
        _id: new ObjectID(),                             //this is the dummy text because beforeEach deletes every thing
        text:'second test todo',
        completed:true,
        completedAt:444
    }
];

const populateTodos = (done)=>{
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
        }).then(() => done());
}

const populateUsers = (done)=>{

    User.remove({}).then(()=>{
        var user1 = new User(users[0]).save();
        var user2 = new User(users[1]).save();

        return Promise.all([user1,user2]);

    }).then(()=>done());
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};