const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "color must have a name"],
    unique: true,
    uniqueCaseSensitive: true,
  },
});

colorSchema.plugin(uniqueValidator, {
  message: "there's already a color with the same name",
});

const color = mongoose.model("color", colorSchema);

module.exports = color;
