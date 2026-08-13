const mongoose  = require("mongoose");
const { v4 } = require("uuid")



const bookProductSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
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
    subCategoryId: {
      type: String,
      required: true,
      trim: true,
    },
    subCategoryTitle: {
      type: String,
      required: true,
      trim: true,
    },
    productId: {
      type: String,
      required: true,
      trim: true,
    },
    productTitle: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: "BookProduct",
    timestamps: true,
  }
);


const bookProduct = mongoose.model("BookProduct", bookProductSchema)


module.exports = {
    bookProduct
}