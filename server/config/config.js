var env = process.env.NODE_ENV || 'development';

console.log('env ****',env);

if(env === 'development' || env === 'test'){

    var config = require('./config.json')  //json file can autometically processed into objects

    var envConfig = config[env];  //when we want to use a variable to access a property we use a bracket notation

    Object.keys(envConfig).forEach((key)=>{
          process.env[key] = envConfig[key];
    })

}

