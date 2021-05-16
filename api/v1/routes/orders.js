const express = require("express");
const {
  getAllOrders,
  getOrder,
  addOrder,
  updateOrder,
  deleteOrder,
  deleteManyOrders,
  updateManyOrders
} = require("../controllers/orders");
const Router = express.Router();
const { protect } = require('../middleware/global');

Router.route("/")
    .get(getAllOrders)
    .post(addOrder)
    .delete(protect, deleteManyOrders)
    .patch(protect, updateManyOrders)

Router.route("/:id")
    .get(getOrder)
    .patch(updateOrder)
    .delete(deleteOrder);


module.exports = Router;
