const{SHA256} = require('crypto-js');
const jwt =require('jsonwebtoken');

// var message ="i am user no 3";
// var hash = SHA256(message).toString();
// console.log(`message: ${message}`);

// console.log(`hash: ${hash}`);
var data = {
    id:5
}

var token  = jwt.sign(data,'abc56');

console.log(token);


var decoded = jwt.verify(token,'abc56');
console.log(decoded);