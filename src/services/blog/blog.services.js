const { blog } = require("../../models/blog.model");
const ApiError = require("../../utils/apiError");
const { uploadToCloud } = require("../../utils/uploadFileToS3");

/* ─── Helper: generate slug ─── */
const generateSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const isAdminRole = (role) => {
  const r = (role || "").toLowerCase();
  return r === "superadmin" || r === "admin";
};

/* ─── ADMIN ─── */

const createBlog = async (req) => {
  const { body } = req;

  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const required = ["title", "category", "content", "excerpt", "author"];
  const missing = required.filter((f) => !body[f]);
  if (missing.length > 0) {
    throw new ApiError(400, `Missing fields: ${missing.join(", ")}`);
  }

  // Generate unique slug
  let slug = generateSlug(body.title);
  const existingSlug = await blog.findOne({ slug });
  if (existingSlug) {
    slug = `${slug}-${Date.now()}`;
  }

  let coverImage = "";
  if (req.file) {
    coverImage = await uploadToCloud(req.file, "Blogs");
  }

  const createdBlog = await blog.create({
    ...body,
    slug,
    coverImage,
  });

  return {
    success: true,
    message: "Blog created successfully",
    data: createdBlog,
  };
};

const getBlogs = async (req) => {
  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const blogs = await blog.find().sort({ createdAt: -1 });

  return {
    success: true,
    message: "Blogs fetched successfully",
    data: blogs || [],
  };
};

const updateBlog = async (req) => {
  const { body } = req;
  const id = req.params.id;

  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const existingBlog = await blog.findById(id);
  if (!existingBlog) {
    throw new ApiError(404, "Blog not found");
  }

  let coverImage = existingBlog.coverImage;
  if (req.file) {
    coverImage = await uploadToCloud(req.file, "Blogs");
  }

  // If title changed, regenerate slug
  let slug = existingBlog.slug;
  if (body.title && body.title !== existingBlog.title) {
    slug = generateSlug(body.title);
    const slugExists = await blog.findOne({ slug, _id: { $ne: id } });
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  const updated = await blog.findByIdAndUpdate(
    id,
    { ...body, slug, coverImage },
    { new: true }
  );

  return {
    success: true,
    message: "Blog updated successfully",
    data: updated,
  };
};

const deleteBlog = async (req) => {
  const id = req.params.id;

  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const deleted = await blog.findByIdAndDelete({ _id: id });
  if (!deleted) {
    throw new ApiError(404, "Blog not found");
  }

  return {
    success: true,
    message: "Blog deleted successfully",
    data: deleted,
  };
};

/* ─── USER (PUBLIC) ─── */

const getActiveBlogs = async (req) => {
  const { category } = req.query;
  const query = { status: true };

  if (category && category !== "all") {
    query.category = { $regex: new RegExp(`^${category}$`, "i") };
  }

  const blogs = await blog.find(query).sort({ createdAt: -1 });

  return {
    success: true,
    message: "Active blogs fetched successfully",
    data: blogs,
  };
};

const getBlogBySlug = async (req) => {
  const { slug } = req.params;
  const foundBlog = await blog.findOne({ slug, status: true });

  if (!foundBlog) {
    throw new ApiError(404, "Blog not found");
  }

  return {
    success: true,
    message: "Blog fetched successfully",
    data: foundBlog,
  };
};

const getBlogById = async (req) => {
  const id = req.params.id;
  const foundBlog = await blog.findById(id);

  if (!foundBlog || !foundBlog.status) {
    throw new ApiError(404, "Blog not found");
  }

  return {
    success: true,
    message: "Blog fetched successfully",
    data: foundBlog,
  };
};

module.exports = {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
  getActiveBlogs,
  getBlogBySlug,
  getBlogById,
};
