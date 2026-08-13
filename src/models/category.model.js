const mongoose  = require("mongoose");
const { v4 } = require("uuid")


const categorySchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: v4
    },
    categoryTitle:{
        type: String,
        required: true,
        trim: true
    },
    categoryImage: {
        type: String,
        required: true
    },
    categoryDescription: {
        type: String,
        reqiured: true,
        trim:true,
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: "Category"
})


const category = mongoose.model("Category", categorySchema)

module.exports = {category}