const Product = require("../mongodb/models/Product");
const connectDb = require('../mongodb/connectDb');
const dotenv = require('dotenv');
const Review = require("../mongodb/models/review");

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

const resetProductsRating = async () => {

    try {
        await Product.updateMany({}, { $set: { ratingsAverage: 0, ratingsCount: 0 } })
        console.log('products updated');
    } catch (error) {
        console.log(error);
    }
}

const deleteAllReviews = async () => {
    try {
        await Review.deleteMany({});
        console.log('all reveiws deleted');
    } catch (error) {
        console.log(error);
    }
}

process.argv[2] === 'removeField' && removeField(process.argv[3])
process.argv[2] === 'resetProductsRating' && resetProductsRating();
process.argv[2] === 'deleteAllReviews' && deleteAllReviews();