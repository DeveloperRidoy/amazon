const Product = require("../mongodb/models/Product");
const connectDb = require('../mongodb/connectDb');
const dotenv = require('dotenv');

// load env
dotenv.config({path: `${__dirname}/../.env.local`})

// database connection
connectDb();

const removeField = async (field) => {
    try {
        await Product.updateMany({}, { specs: [] });
        console.log(`${field} field deleted`);
    } catch (error) {
        console.log(error);
    }
}


process.argv[2] === 'removeField' && removeField(process.argv[3])