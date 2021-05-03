const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category must have a name'],
        unique: true,
        uniqueCaseSensitive: true
    }
})

categorySchema.plugin(uniqueValidator, {
    message: "there's already a category with the same name"
});

const Category = mongoose.model('category', categorySchema);

module.exports = Category;