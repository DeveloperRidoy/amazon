const express = require("express");
const {
  getAllOrders,
  getOrder,
  addOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orders");
const Router = express.Router();

Router.route("/")
    .get(getAllOrders)
    .post(addOrder);

Router.route("/:id")
    .get(getOrder)
    .patch(updateOrder)
    .delete(deleteOrder);


module.exports = Router;
