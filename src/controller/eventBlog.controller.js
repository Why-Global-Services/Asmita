const { catchAsync } = require("../utils/catchAsync");
const eventServices = require("../services/events/events.services");
const blogServices = require("../services/blog/blog.services");

/* ─── PUBLIC USER CONTROLLERS ─── */

// Events
const getActiveEventsController = catchAsync(async (req, res) => {
  const data = await eventServices.getActiveEvents(req);
  res.status(200).send(data);
});

const getEventByIdController = catchAsync(async (req, res) => {
  const data = await eventServices.getEventById(req);
  res.status(200).send(data);
});

// Blog
const getActiveBlogsController = catchAsync(async (req, res) => {
  const data = await blogServices.getActiveBlogs(req);
  res.status(200).send(data);
});

const getBlogBySlugController = catchAsync(async (req, res) => {
  const data = await blogServices.getBlogBySlug(req);
  res.status(200).send(data);
});

const getBlogByIdController = catchAsync(async (req, res) => {
  const data = await blogServices.getBlogById(req);
  res.status(200).send(data);
});

module.exports = {
  getActiveEventsController,
  getEventByIdController,
  getActiveBlogsController,
  getBlogBySlugController,
  getBlogByIdController,
};
