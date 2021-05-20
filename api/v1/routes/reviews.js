const express = require('express');
const { protect } = require('../middleware/global');
const Router = express.Router();
const {getAllReviews, getReview, updateReview, addReview, deleteReview} = require('../controllers/reviews');


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