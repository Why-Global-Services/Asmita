const mongoose = require("mongoose");
const { v4 } = require("uuid");

const roleSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: v4,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["superAdmin", "admin", "user"],
        required: true
    },
    active: {
        type: Boolean,
        default: true,
    },
    archive: {
        type: Boolean,
        default: false,
    }
},{
    timestamps: true,
    collection: "role"
})


const role = mongoose.model("role", roleSchema)


module.exports = {role};