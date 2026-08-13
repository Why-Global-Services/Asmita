const mongoose = require("mongoose");
const { v4 } = require("uuid");

const productSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: v4,
    },
    categoryId: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    subCategoryId: {
      type: String,
     
    },
    subCategoryName: {
      type: String,
      
    },
     filterId: {
      type: String,
      trim: true
    },
    filterName: {
      type: String,
      trim: true
    },
    productTitle: {
      type: String,
      required: true,
      trim: true,
    },
    productDescription: {
      type: String,
      required: true,
      trim: true,
    },
    productImages: {
      type: [String],
      required: true,
      validate: {
        validator: function (val) {
          return val.length <= 4; // max 4 images
        },
        message: "You can upload a maximum of 4 images",
      },
    },
    status: {
      type: Boolean,
      default: true,
    },
    ingredients: {
      type: [String],
    },
    additionalInformation: {
      type: String,
    },
  },
  {
    collection: "Products",
    timestamps: true,
  }
);

const products = mongoose.model("Products", productSchema);

module.exports = {
  products,
};
