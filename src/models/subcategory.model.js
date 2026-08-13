const mongoose = require("mongoose");
const { v4 } = require("uuid");

const subCategorySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: v4,
    },
    categoryId: {
      type: String,
      required: true,
      trim: true,
    },
    categoryTitle: {
      type: String,
      required: true,
      trim: true,
    },
    subCategoryTitle: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "SubCategory",
  }
);

const subCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = { subCategory };