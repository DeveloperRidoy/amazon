const catchAsync = require("../../../utils/api/catchAsync");
const AppError = require("../controllers/appError");
const jwt = require('jsonwebtoken');
const User = require("../../../mongodb/models/User");


// restrict request based on user role
exports.restrictTo = (...roles) => (req, res, next) => {
  const userRole = req.user.role; //expecting user data in the req
  const userAllowed = roles.some(role => role === userRole);
  if (!userAllowed) return next(new AppError(403, 'User not authorized'));
  
  // go to next middleware if user is allowed
  next();
}

// check duplicate doc
exports.checkDuplicateDoc = (Model, query) => catchAsync(async (req, res, next) => {
    const docName = Model.collection.name.slice(0, Model.collection.name.length - 1);
    // check if id is in correct format
    if (req.params.id.length !== 24) return next(new AppError(400, 'invalid id'));
    const duplicateDoc = query
      ? await Model.findOne(query)
      : await Model.findById(req.params.id);

    if (duplicateDoc) return next(new AppError(403, `${docName} with the same ${Object.keys(query).map(key)} already exists`));

})


// protect next middlewares from signed out users
exports.protect = catchAsync(async (req, res, next) => {
  // (1) see if token was provided
  const token = req.cookies['user-auth-token']
    ? req.cookies['user-auth-token']  
    : req.headers.authorization && req.headers.authorization.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : ''
  if(!token) return next(new AppError(403, 'Please login to get access'))

  // (2) see if token is valid
  const validToken = jwt.decode(token, process.env.JWTSECRET);
  if(!validToken) return next(new AppError(403, 'Please login to get access'));

  // (3) get user by token info
  const user = await User.findById(validToken.id).select('+password +passwordChangedAt');
  if (!user) return next(new AppError(404, 'User doesn\'t exist anymore '))
  
  // (4) check if user changed password after creating the token
  const tokenExpired = validToken.iat * 1000 < user.passwordChangedAt;
  if(tokenExpired) return next(new AppError(403, 'User recently changed password.Please login again'))

  // (5) inject user in the req for next middleware
  req.user = user;
  // (6) proceed to next middleware
  next();
})
