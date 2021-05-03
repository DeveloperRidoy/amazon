const Color = require("../../../mongodb/models/Color");
const catchAsync = require("../../../utils/api/catchAsync");
const {
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} = require("./handlerFactory");
const AppError = require("./appError");

// @route          GET /api/v1/colors/:id
// @desc           Get Color by id
// @accessibility  Public
exports.getAllColors = getDocs(Color);

// @route          GET /api/v1/colors/
// @desc           Get all colors
// @accessibility  Public
exports.getColor = getDoc(Color);

// @route          GET /api/v1/colors/Color/:slug
// @desc           Get Color by slug
// @accessibility  Public
exports.getColorBySlug = catchAsync(async (req, res, next) => {
  const Color = await Color.findOne({ slug: req.params.slug });

  if (Color === null) return next(new AppError(404, "resource not found"));

  return res.json({
    status: "success",
    data: { Color },
  });
});

// @route          POST /api/v1/colors/
// @desc           Add a Color
// @accessibility  Private
exports.addColor = addDoc(Color);

// @route          PATCH /api/v1/colors/:id
// @desc           Update Color
// @accessibility  Private
exports.updateColor = updateDoc(Color);

// @route          DELETE /api/v1/colors/:id
// @desc           Delete Color
// @accessibility  Private
exports.deleteColor = deleteDoc(Color);
