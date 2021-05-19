const express = require('express');
const { protect, restrictTo } = require('../middleware/global');
const Router = express.Router();
const {getAllReviews, getReview, updateReview, addReview, deleteReview} = require('../controllers/reviews');
const { USER } = require('../../../utils/variables');


// routes
Router.route('/')
    .get(getAllReviews)

// protect the below routes
Router.use(protect)

Router.post('/', addReview);

Router.route('/:id')
    .get(getReview)
    .patch(updateReview)
    .delete(deleteReview)

module.exports = Router;