const express = require("express");
const { createCheckoutSession } = require("../controllers/checkout");

const Router = express.Router();


Router.route("/")
    .post(createCheckoutSession)

 

module.exports = Router;
 