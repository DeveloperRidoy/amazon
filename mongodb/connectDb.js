const mongoose = require('mongoose');


const connectDb = async () => {
    try {
        const db = process.env.DATABASE;
        await mongoose.connect(db, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log('db connected...');
    } catch (error) {
        // console.log('Connection failed.💥 Shutting down application...');
        console.log(error);
        // stop application on failed connection
        process.exit(1);
    }
} 
 
module.exports = connectDb;