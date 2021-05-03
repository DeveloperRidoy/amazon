const catchAsync = require("../../../utils/api/catchAsync");
const AppError = require("./appError");
const bcrypt = require('bcrypt');
const jwtCookieToken = require("../../../utils/jwtCookieToken");
const jwt = require('jsonwebtoken');
const User = require("../../../mongodb/models/User");

// @route          POST /api/v1/users/signup
// @desc           signup user
// @accessibility  Public
exports.signup = catchAsync(async (req, res, next) => {
  // create user 
  const user = await User.create(req.body)

  // sign json webtoken and attach in cookie
  const token = jwtCookieToken(user, req, res, next);

  res.json({
    status: "success",
    message: "signup successful!",
    data: { token, user },
  });
})


// @route          POST /api/v1/users/login
// @desc           login user
// @accessibility  Public

exports.login = catchAsync(async (req, res, next) => {
  // (1) get login inf from body
  const { email, password } = req.body;

  // (2) check if email and password was provided
  if (!email || !password)
    return next(new AppError(400, "Please provide both email and password"));

  // (3) check if user with the email exists or not
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError(404, "Account does not exist"));

  // (4) check if password is correct
  const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) return next(new AppError(400, 'Invalid credentials'));
    
  // (5) sign json webtoken and attach in cookie
  const token = jwtCookieToken(user, req, res);

  // (6) remove password before sending user data
  user.password = undefined;
  
  return res.json({
    status: "success",
    message: 'login successful!',
    data: {token, user}
  });
});

// @route          GET /api/v1/users/logout
// @desc           logout user
// @accessibility  Private
exports.logout = catchAsync(async (req, res) => {

  // expire the cookie
  res.cookie("user-auth-token", "logged out", {
    expires: new Date(Date.now() + 1000),
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    httpOnly: true,
    path: "/"
  });
  res.json({
    status: 'success',
    message: 'Logged out successfully!',
    data: {cookie: req.cookies['user-auth-token']}
  })
  
})

// @route          POST /api/v1/users/update-password
// @desc           Update user password
// @accessibility  Private

exports.updatePassword = catchAsync(async (req, res, next) => {

    // (1) expecting user to be injected in the req from protect middleware
    const user = req.user;

    // (1) extract info from body
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // (2) check if all info was provided
    if (!oldPassword || !newPassword || !confirmPassword) return next(new AppError(400, 'Please provide oldPassword, newPassword and confirmPassword field '));

    // (3) check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) return next(new AppError(400, 'Passwords do not match. Please try again'));

    // (4) check if old password is correct
    const correctPassword = await bcrypt.compare(oldPassword, user.password);
    if (!correctPassword) return next(new AppError(400, 'Incorrect password.Please try again.'));

    // (5) update user password
    user.password = newPassword;
    user.confirmPassword = confirmPassword;
    await user.save({validateModifiedOnly: true});

    // (6) sign json webtoken and attach in cookie
    const token = jwtCookieToken(user, req, res);

    // (7) return response with token
    res.json({
        status: 'success',
        message: 'Password updated successfully!',
        data: {token, user}
    })

})


// @route          GET /api/v1/users/auth
// @desc           check if user is logged in
// @accessibility  Public        

exports.auth = async (req, res, next) => {
  try {
    // (1) check if there is a user-auth-token
    const token = req.headers.authorization
      ? req.headers.authorization.startsWith('Bearer') && req.headers.authorization.split(' ')[1]
      : req.cookies['user-auth-token']
    if (!token) return res.json({status: 'fail', message: 'not logged in'})

    // (2) check if token is valid
    const validToken = jwt.verify(token, process.env.JWTSECRET);

    // (3) check if user exists with the token id
    const user = await User.findById(validToken.id).select('+passwordChangedAt');
    if (!user) return res.json({status: 'fail', message: 'not logged in'})
    
    // (4) check if user changed password after getting the token
    const tokenExpired = new Date(user.passwordChangedAt * 1) > validToken.iat * 1000
      ? true
      : false
    if(tokenExpired) return res.json({status: 'fail', message: 'not logged in'})
    
    // (5) remove paswordChangeAt before sending user data
    user.passwordChangedAt = undefined;
    req.user = user;
    return res.json({
      status: "success",
      message: 'logged in',
      data: {user}
    })
  } catch (error) {
    return res.json({status: 'fail', message: 'not logged in'});
  }

}