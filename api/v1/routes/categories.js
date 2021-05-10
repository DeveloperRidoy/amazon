const express = require("express");
const {
  getAllCategories,
  getCategory,
  addCategory,
  updateCategory,
  getCategoryBySlug,
  deleteCategory,
} = require("../controllers/categories");
const Router = express.Router();

Router.route("/")
.get(getAllCategories)
.post(addCategory);

Router.route("/:id")
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

Router.route("/Category/:slug").get(getCategoryBySlug);

module.exports = Router;
