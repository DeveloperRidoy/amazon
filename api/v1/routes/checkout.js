const express = require("express");
const { createCheckoutSession, placeOrder } = require("../controllers/checkout");
const { protect } = require("../middleware/global");

const Router = express.Router();


Router.use(protect);

Router.post("/create-checkout-session", createCheckoutSession);
Router.post("/place-order", placeOrder)
   
 

module.exports = Router;
    