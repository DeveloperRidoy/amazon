const express = require("express");
const Category = require("../../../mongodb/models/Category");
const {
  getAllCategories,
  getCategory,
  addCategory,
  updateCategory,
  getCategoryBySlug,
  deleteCategory,
} = require("../controllers/Categories");
const { checkDoc } = require("../middleware/global");
const Router = express.Router();

Router.route("/")
.get(getAllCategories)
.post(addCategory);

Router.route("/:id")
  .all(checkDoc(Category))
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

Router.route("/Category/:slug").get(getCategoryBySlug);

module.exports = Router;
