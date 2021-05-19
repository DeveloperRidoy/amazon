const { findOneAndDelete } = require("../../../mongodb/models/review");
const Review = require("../../../mongodb/models/review");
const catchAsync = require("../../../utils/api/catchAsync");
const AppError = require("./appError");
const {
  deleteDoc,
  getDoc,
  addDoc,
  updateDoc,
  getDocs,
} = require("./handlerFactory");

// @route          POST /api/v1/Reviews/
// @desc           Add a Review
// @accessibility  Private
exports.addReview = catchAsync(async (req, res, next) => {

    // check if user already reviews same product 
    const duplicateReview = await Review.findOne({ user: req.user._id, product: req.body.product });
    if (duplicateReview) return next(new AppError(400, 'You have already reviewed the product'));

    // add review 
    const review = await Review.create({ ...req.body, user: req.user._id });
    return res.json({
        status: 'succes',
        message: 'review added',
        data: { review }
    })
})

// @route          GET /api/v1/Reviews/
// @desc           Get all Reviews
// @accessibility  Public
exports.getAllReviews = getDocs(Review);

// @route          GET /api/v1/Reviews/:id
// @desc           Get Review by id
// @accessibility  Public
exports.getReview = getDoc(Review);

// @route          DELETE /api/v1/Reviews/:id
// @desc           Delete Review by id
// @accessibility  Public
exports.deleteReview = catchAsync(async (req, res, next) => {
  const deletedReview =  await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!deletedReview) return next(new AppError(400, 'no such review'))
  
  return res.json({
    status: 'success',
    message: 'review deleted'
  })
})

// @route          PATCH /api/v1/Reviews/:id
// @desc           Update Review
// @accessibility  Private
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $set: req.body }, { new: true, useFindAndModify: false, context: 'query', runValidators: true });

  if (!review) return next(new AppError(400, 'no such review'));

  return res.json({
    status: 'success',
    message: 'review updated',
    data: {review}
  })
})
 
