const User = require("../../../mongodb/models/User");
const catchAsync = require("../../../utils/api/catchAsync");
const AppError = require("./appError");
const { deleteDoc, getDoc, getDocs } = require("./handlerFactory");
const bcrypt = require('bcrypt');

// @route          GET /api/v1/users/
// @desc           Get all users
// @accessibility  Public
exports.getAllUsers = getDocs(User);

// @route          GET /api/v1/users/:id
// @desc           Get user by id
// @accessibility  Public
exports.getUser = getDoc(User);

// @route          DELETE /api/v1/users/:id
// @desc           Delete user by id
// @accessibility  Public
exports.deleteUser = deleteDoc(User);

// @route          PATCH /api/v1/users/:id
// @desc           Admin updates user
// @accessibility  Private
exports.updateUser = catchAsync(async (req, res, next) => {
  // hash bassword with bcrypt if there is password 
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 12);
    req.body.passwordChangedAt = Date.now() - 2000;
  }

  // change firstname if there is name
  if (req.body.name) { req.body.firstName = req.body.name.split(' ')[0] };

  const user = await User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { useFindAndModify: false, new: true });
  
  return res.json({
    status: 'success',
    data: {user}
  })
})

// @route          PATCH /api/v1/users/update-me
// @desc           User updates him/her self
// @accessibility  Private
exports.updateMe = catchAsync(async (req, res, next) => {
 
  const hasPassword = Object.keys(req.body).some(
    (field) => field === "password"
  );
  if (hasPassword)
    return next(new AppError(403, "User not authorized to update password"));
  
  // update user
  const user = await User.findOneAndUpdate({ _id: req.user._id }, { $set: req.body }, { useFindAndModify: false, new: true });

  // remove sensitive data before sending response
  user.password = undefined;
  user.confirmPassword = undefined;
  user.__v = undefined;

  // return response
  return res.json({
    status: "success",
    message: "user updated successfully!",
    data: { user },
  });
})


// @route          DELETE /api/v1/users/update-me
// @desc           User deletes him/herselt 
// @accessibility  Private

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  await user.remove();
  res.cookie("user-auth-token", "expired", {
    expires: new Date(Date.now() + 1000),
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    httpOnly: true,
    path: "/",
  });
  res.json({
    status: 'success',
    message: 'Account Deleted!'
  })
})

// @route          GET /api/v1/users/query
// @desc           Get user by query
// @accessibility  Private

exports.getUsersByQuery = catchAsync(async (req, res, next) => {
  const query = {};
  Object.keys(req.body).forEach(key => query[key] = new RegExp(`${req.body[key]}`, 'i'));
  const data = await User.find(query);
  return res.json({
    status: 'success',
    data: {[User.collection.name]: data}
  })
})