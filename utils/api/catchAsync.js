const mongoose = require("mongoose");
const AppError = require("../../api/v1/controllers/appError");

const catchAsync = (fn) => (req, res, next) => {
    return fn(req, res, next).catch(err => {
        // send 400 response on mongoose validation error
        if (err instanceof mongoose.Error.ValidationError) {
            const message = Object.keys(err.errors).map(key => err.errors[key].message )[0];
            return next(new AppError(400, message));
        }
        
        // send 500 response for unhandled server error
        return next(new AppError(500, err.message))

    })
}

module.exports = catchAsync;