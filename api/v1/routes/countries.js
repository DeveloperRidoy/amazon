const express = require("express");
const Country = require("../../../mongodb/models/Country");
const {
  getAllCountries,
  getCountry,
  addCountry,
  updateCountry,
  getCountryBySlug,
  deleteCountry,
} = require("../controllers/Countries");
const { checkDoc } = require("../middleware/global");
const Router = express.Router();

Router.route("/").get(getAllCountries).post(addCountry);

Router.route("/:id")
  .all(checkDoc(Country))
  .get(getCountry)
  .patch(updateCountry)
  .delete(deleteCountry);

Router.route("/country/:slug").get(getCountryBySlug);

module.exports = Router;
