const express = require("express");
const { createCheckoutSession } = require("../controllers/checkout");
const { protect } = require("../middleware/global");

const Router = express.Router();


Router.use(protect);

Router.route("/")
    .post(createCheckoutSession)

 

module.exports = Router;
 