const mongoose = require("mongoose");
const { v4 } = require("uuid");

const eventSchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        "Health Camp",
        "Webinar",
        "Workshop",
        "Conference",
        "Awareness Program",
      ],
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    bannerImage: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "Events",
    timestamps: true,
  }
);

const event = mongoose.model("Events", eventSchema);

module.exports = { event };
