const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema([
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Order must have a user id"],
    },
    metadata: {
      firstName: {
        type: String,
        required: [true, "metadata must have a firstName"],
      },
      lastName: {
        type: String,
        required: [true, "metadata must have a lastName"],
      },
      companyName: String,
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "country",
        required: [true, "metadata must have a country"],
      },
      streetAddress1: {
        type: String,
        required: [true, "metadata must have a streetAddress1"],
      },
      streetAddress2: String,
      townOrCity: {
        type: String,
        required: [true, "metadata must have a townOrCity"],
      },
      zip: {
        type: String,
        required: [true, "metadata must have a zip code"],
      },
      phone: {
        type: Number,
        required: [true, "metadata must have a phone number"],
      },
      email: {
        type: String,
        required: [true, "metadata must have a email"],
        validation: {
          validator: (val) =>
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              val
            ),
          message: "{VALUE} is not a valid email address",
        }
      },
      note: String
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: [true, "product must have a product id"],
        },
        quantity: {
          type: Number,
          required: [true, "product must have a quantity"],
        },
        price: {
          type: Number,
          required: [true, "product must have a price"],
        },
        totalPrice: {
          type: Number,
          required: [true, "product must have a total price"],
        },
      },
    ],
  },
]);


const Order = mongoose.model('order', OrderSchema);

module.exports = Order;