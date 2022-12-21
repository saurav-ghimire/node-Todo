let mongoose = require('mongoose');

let dbConnection = async () => {
    mongoose.Promise = global.Promise;
    mongoose.set('returnOriginal', false);
    await mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
        console.log("Database connected successfully");
    }).catch(err => {
        console.error("***** Error while connecting database: "+err.message+" *****");
    });
};

dbConnection();