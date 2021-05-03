const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "country must have a name"],
    unique: true,
    uniqueCaseSensitive: true,
  },
});

countrySchema.plugin(uniqueValidator, {
  message: "there's already a country with the same name",
});

const Country = mongoose.model("country", countrySchema);

module.exports = Country;
