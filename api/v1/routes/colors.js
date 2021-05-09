const express = require("express");
const {
  getAllColors,
  getColor,
  addColor,
  updateColor,
  getColorBySlug,
  deleteColor,
} = require("../controllers/colors");
const Router = express.Router();

Router.route("/").get(getAllColors).post(addColor);

Router.route("/:id")
  .get(getColor)
  .patch(updateColor)
  .delete(deleteColor);

Router.route("/color/:slug").get(getColorBySlug);

module.exports = Router;
