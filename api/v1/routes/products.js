const express = require("express");
const Product = require("../../../mongodb/models/Product");
const { checkDoc, protect, restrictTo } = require("../middleware/global");
const Router = express.Router();
const {
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addProduct,
  getProductBySlug,
} = require("../controllers/Products");
const { ADMIN } = require("../../../utils/variables");
const { uploadPhotos, resizePhotos } = require("../middleware/multer");

Router.route("/")
  .get(getAllProducts)
  .post(protect, restrictTo(ADMIN), uploadPhotos, resizePhotos(), addProduct)
    
Router.get('/product/slug', getProductBySlug)
     
Router.route("/:id")
  .all(checkDoc(Product))
  .get(getProduct)
  .patch(protect, restrictTo(ADMIN), uploadPhotos, resizePhotos(), updateProduct)
  .delete(protect, deleteProduct);

module.exports = Router;
          