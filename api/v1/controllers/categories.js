const Category = require("../../../mongodb/models/Category");
const catchAsync = require("../../../utils/api/catchAsync");
const {
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} = require("./handlerFactory");
const AppError = require("./appError");

// @route          GET /api/v1/categories/:id
// @desc           Get Category by id
// @accessibility  Public
exports.getAllCategories = getDocs(Category);

// @route          GET /api/v1/categories/
// @desc           Get all categories
// @accessibility  Public
exports.getCategory = getDoc(Category);

// @route          GET /api/v1/categories/Category/:slug
// @desc           Get Category by slug
// @accessibility  Public
exports.getCategoryBySlug = catchAsync(async (req, res, next) => {
  const Category = await Category.findOne({ slug: req.params.slug });
       
  if (Category === null) return next(new AppError(404, "resource not found"));

  return res.json({
    status: "success",
    data: { Category },
  });
});

// @route          POST /api/v1/categories/
// @desc           Add a Category
// @accessibility  Private
exports.addCategory = addDoc(Category);

// @route          PATCH /api/v1/categories/:id
// @desc           Update Category
// @accessibility  Private
exports.updateCategory = updateDoc(Category);

// @route          DELETE /api/v1/categories/:id
// @desc           Delete Category
// @accessibility  Private
exports.deleteCategory = deleteDoc(Category);
