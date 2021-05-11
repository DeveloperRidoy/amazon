const express = require("express");
const { createCheckoutSession, placeOrder } = require("../controllers/checkout");
const { protect } = require("../middleware/global");

const Router = express.Router();


Router.post("/create-checkout-session", protect, createCheckoutSession);
Router.post("/place-order", placeOrder)
   
 

module.exports = Router;
    