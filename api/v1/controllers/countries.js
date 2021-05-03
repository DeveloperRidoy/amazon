const Country = require("../../../mongodb/models/Country");
const catchAsync = require("../../../utils/api/catchAsync");
const {
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} = require("./handlerFactory");
const AppError = require("./appError");

// @route          GET /api/v1/countries/:id
// @desc           Get Country by id
// @accessibility  Public
exports.getAllCountries = getDocs(Country);

// @route          GET /api/v1/countries/
// @desc           Get all countries
// @accessibility  Public
exports.getCountry = getDoc(Country);

// @route          GET /api/v1/countries/Country/:slug
// @desc           Get Country by slug
// @accessibility  Public
exports.getCountryBySlug = catchAsync(async (req, res, next) => {
  const country = await Country.findOne({ slug: req.params.slug });

  if (country === null) return next(new AppError(404, "resource not found"));

  return res.json({
    status: "success",
    data: { Country },
  });
});

// @route          POST /api/v1/countries/
// @desc           Add a Country
// @accessibility  Private
exports.addCountry = addDoc(Country);

// @route          PATCH /api/v1/countries/:id
// @desc           Update country
// @accessibility  Private
exports.updateCountry = updateDoc(Country);

// @route          DELETE /api/v1/countries/:id
// @desc           Delete country
// @accessibility  Private
exports.deleteCountry = deleteDoc(Country);