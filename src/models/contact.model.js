const mongoose  = require("mongoose");
const { v4 } = require("uuid")


const contactSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: v4
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
    }
, }, {
    collection: "Contact",
    timestamps: true
}
)


const contact = mongoose.model("Contact", contactSchema)


module.exports = {
    contact
}