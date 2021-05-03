const express = require("express");
const Color = require("../../../mongodb/models/Color");
const {
  getAllColors,
  getColor,
  addColor,
  updateColor,
  getColorBySlug,
  deleteColor,
} = require("../controllers/colors");
const { checkDoc } = require("../middleware/global");
const Router = express.Router();

Router.route("/").get(getAllColors).post(addColor);

Router.route("/:id")
  .all(checkDoc(Color))
  .get(getColor)
  .patch(updateColor)
  .delete(deleteColor);

Router.route("/color/:slug").get(getColorBySlug);

module.exports = Router;
