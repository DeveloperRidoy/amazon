const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product must have a name"],
      unique: true,
      uniqueCaseInsensitive: true,
    },
    slug: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Product must have a price"],
    },
    coverPhoto: {
      type: String,
      required: [true, "Product must have a photo"],
    },
    photos: [String],
    colors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "color",
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Product must have a category"],
    },
    variants: [
      {
        size: {
          height: {
            type: Number,
            required: [true, "size must have a height"],
          },
          width: {
            type: Number,
            required: [true, "size must have a width"],
          },
        },
        price: {
          type: Number,
          required: [true, "Variant must have a price"],
        },
        stock: {
          type: Number,
          requied: [true, "Variant must have stock amount"],
        },
      },
    ],
    ratingsCount: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Product must have a minimum rating of 0"],
      max: [5, "Product must have a maximum rating of 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    summary: {
      type: String,
      required: [true, "Product must have a summary"],
    },
    description: {
      type: String,
      required: [true, "Product must have a description"],
    },
    material: String,
    brand: String,
    stock: {
      type: Number,
      required: [true, "Product must have a stock amount"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    specs: [{
      name: String,
      value: String
    }],
    gender: {
      type: String,
      default: 'all',
      enum: {
        values: ["male", "female", "all"],
        message: "Gender can only be male, female or all",
      },
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    shippingCountries: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'country'
    }],
    sizes: {
      type: [String],
      enum: {
        values: ['sm', 'lg', 'xl'],
        message: 'sizes can only be one of sm, lg or xl'
      }
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().split(' ').join('-');
  next()
})

productSchema.plugin(uniqueValidator, {
  message: "there's already a product with the same {PATH}"
})

productSchema.pre(/^find/, function (next) {
  this.select('-__v').populate(['category', 'colors', 'shippingCountries']);
  next();
})

const Product = mongoose.model('product', productSchema);

module.exports = Product;  