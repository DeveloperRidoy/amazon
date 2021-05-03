const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    defaullt: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Please provide user field with the userID"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: [true, "Please provide product field with the productID"],
    },
  review: {
    type: String,
    required: [true, 'Please provide review field']
   } 
});

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;