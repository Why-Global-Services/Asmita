const { event } = require("../../models/event.model");
const ApiError = require("../../utils/apiError");
const { uploadToCloud } = require("../../utils/uploadFileToS3");

const isAdminRole = (role) => {
  const r = (role || "").toLowerCase();
  return r === "superadmin" || r === "admin";
};

/* ─── ADMIN ─── */

const createEvent = async (req) => {
  const { body } = req;

  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const required = ["title", "description", "eventType", "eventDate", "startTime", "endTime", "location"];
  const missing = required.filter((f) => !body[f]);
  if (missing.length > 0) {
    throw new ApiError(400, `Missing fields: ${missing.join(", ")}`);
  }

  // Check duplicate title
  const existing = await event.findOne({
    title: { $regex: new RegExp(`^${body.title.trim()}$`, "i") },
  });
  if (existing) {
    throw new ApiError(400, "Event title already exists");
  }

  let bannerImage = "";
  if (req.file) {
    bannerImage = await uploadToCloud(req.file, "Events");
  }

  const createdEvent = await event.create({
    ...body,
    bannerImage,
  });

  return {
    success: true,
    message: "Event created successfully",
    data: createdEvent,
  };
};

const getEvents = async (req) => {
  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const events = await event.find().sort({ eventDate: 1 });

  return {
    success: true,
    message: "Events fetched successfully",
    data: events || [],
  };
};

const updateEvent = async (req) => {
  const { body } = req;
  const id = req.params.id;

  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const existingEvent = await event.findById(id);
  if (!existingEvent) {
    throw new ApiError(404, "Event not found");
  }

  let bannerImage = existingEvent.bannerImage;
  if (req.file) {
    bannerImage = await uploadToCloud(req.file, "Events");
  }

  const updated = await event.findByIdAndUpdate(
    id,
    { ...body, bannerImage },
    { new: true }
  );

  return {
    success: true,
    message: "Event updated successfully",
    data: updated,
  };
};

const deleteEvent = async (req) => {
  const id = req.params.id;

  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const deleted = await event.findByIdAndDelete({ _id: id });
  if (!deleted) {
    throw new ApiError(404, "Event not found");
  }

  return {
    success: true,
    message: "Event deleted successfully",
    data: deleted,
  };
};

/* ─── USER (PUBLIC) ─── */

const getActiveEvents = async (req) => {
  const { eventType, filter: timeFilter } = req.query;

  const query = { status: true };
  if (eventType && eventType !== "all") {
    query.eventType = eventType;
  }

  const now = new Date();

  let sort = { eventDate: 1 };
  if (timeFilter === "past") {
    query.eventDate = { $lt: now };
    sort = { eventDate: -1 };
  } else {
    // upcoming (default)
    query.eventDate = { $gte: now };
  }

  const activeEvents = await event.find(query).sort(sort);

  return {
    success: true,
    message: "Active events fetched successfully",
    data: activeEvents,
  };
};

const getEventById = async (req) => {
  const id = req.params.id;
  const foundEvent = await event.findById(id);
  if (!foundEvent || !foundEvent.status) {
    throw new ApiError(404, "Event not found");
  }

  return {
    success: true,
    message: "Event fetched successfully",
    data: foundEvent,
  };
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getActiveEvents,
  getEventById,
};
