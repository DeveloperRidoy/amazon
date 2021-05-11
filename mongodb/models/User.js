const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const { USER, ADMIN } = require("../../utils/variables");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a username"],
  },
  firstName: String,
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
    required: [true, "Please provide an email address"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    validate: {
      validator: (val) => val.length >= 8 && val.length <= 16,
      message: "Password must be 8 to 16 characters long",
    },
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords do not match",
    },
  },
  role: {
    type: String,
    default: USER,
    enum: {
      values: [USER, ADMIN],
      message: `users may have one these roles: '${USER}, ${ADMIN}'`,
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  phone: Number,
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: [true, "Please provide product object"],
      },
      quantity: {
        type: Number,
        required: [true, "please provide product quantity"],
      },
      shippingCountry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "country",
        required: [true, "please provide shippingCountry"],
      },
      color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "color",
      },
      size: {
        type: String,
        enum: {
          values: ["sm", "lg", "xl"],
          message: "size can onle be one of sm, lg and xl",
        },
      },
    },
  ],
  billing: {
    firstName: {
      type: String,
      required: [true, "please provide first name"],
    },
    lastName: {
      type: String,
      required: [true, "please provide last name"],
    },
    companyName: String,
    country: {
      type: String,
      required: [true, "please provide country"],
    },
    streetAddress1: {
      type: String,
      required: [true, "please provide street address1"],
    },
    streetAddress2: String,
    townOrCity: {
      type: String,
      required: [true, "please provide townOrCity name"],
    },
    zip: {
      type: String,
      required: [true, "please provide zip code"],
    },
    phone: {
      type: Number,
      maxLength: 11,
      required: [true, "please provide phone number"],
    },
    email: {
      type: String,
      required: [true, "please provide email address"],
    },
  },
});

// unique fields error message
userSchema.plugin(uniqueValidator, {
  message: "Email already taken. Please try another one",
});

// encrypt password before creating user and after validation
userSchema.pre("save", async function (next) {
  // update firstName based on name
  this.firstName = this.name.split(" ")[0];

  // go to next middleware if password was not modified
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  this.passwordChangedAt = Date.now() - 2000;
  this.firstName = this.name.split(" ")[0];
  next();
});

// pre find
userSchema.pre(/^find/, function (next) {
  this.populate(["cart.product", "cart.color", "cart.shippingCountry"]);
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
