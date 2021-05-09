const express = require("express");
const {
  getAllCountries,
  getCountry,
  addCountry,
  updateCountry,
  getCountryBySlug,
  deleteCountry,
} = require("../controllers/Countries");
const Router = express.Router();

Router.route("/").get(getAllCountries).post(addCountry);

Router.route("/:id")
  .get(getCountry)
  .patch(updateCountry)
  .delete(deleteCountry);

Router.route("/country/:slug").get(getCountryBySlug);

module.exports = Router;
