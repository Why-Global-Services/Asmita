const mongoose = require("mongoose");
const { v4 } = require("uuid");

const blogSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: v4,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    author: {
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
    collection: "Blogs",
    timestamps: true,
  }
);

const blog = mongoose.model("Blogs", blogSchema);

module.exports = { blog };
