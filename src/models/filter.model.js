const { default: mongoose } = require("mongoose");
const { v4 } = require("uuid");

const filterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: v4
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
    filterName: {
        type: String,
        trim:true,
    }
},{
    collection: "filter",
    timestamps: true
})


const filter = mongoose.model("filter", filterSchema)


module.exports = {
    filter
}