const mongoose = require('mongoose');
const Product = require('./Product');

const reviewSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Please provide user field with the userID"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: [true, "Please provide product field with the productID"]
    },
  review: {
    type: String,
    required: [true, 'Please provide review field']
  },
  rating: {
    type: Number,
    validate: {
      validator: val => val >= 1 && val <= 5,
      message: "reveiw must be an integer between 1 to 5"
    },
    required: [true, "please provide a rating between 0 to 5"]
  }
});

// indexing for better performance 
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// static method to update product rating based on reviews..this refers to the model
reviewSchema.statics.updateProductRatings = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        ratingsCount: { $sum: 1 },
        ratingsAverage: {$avg: '$rating'}
    }}
  ]);
  
  await Product.findByIdAndUpdate(productId, {
    $set: {
      ratingsCount: stats.length > 0 ? stats[0].ratingsCount : 0,
      ratingsAverage: stats.length > 0 ? stats[0].ratingsAverage : 1
    }
  }, { validateModifiedOnly: true, useFindAndModify: false });
}

reviewSchema.post(/^findOneAnd/, async function (doc, next) {
  doc && await doc.constructor.updateProductRatings(doc.product);
  next();
})

reviewSchema.post('save', async function (doc, next) {
  await doc.constructor.updateProductRatings(doc.product);
  next();
})

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: '-cart -billing' });
  next();
})

// static method...example: await Review.sayHello()
// reviewSchema.statics.sayHello = () => console.log('hello');
// instance method..example: await Review.findOne({...}).exec( async (err, Review) => await Review.sayHello())
// reviewSchema.methods.sayHello = () => console.log('hello');
// all instance of this model has access to the instance method


const Review = mongoose.model('review', reviewSchema);

module.exports = Review;