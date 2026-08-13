import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUpload, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { createBlog, updateBlog } from "../Interceptor/interceptor";

const BLOG_CATEGORIES = [
  "Healthcare",
  "Wellness",
  "Nutrition",
  "Medical Equipment",
  "Research",
  "Tips & Advice",
  "News",
  "Other",
];

const BlogForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { blog, mode } = location.state || {};
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    author: "",
    status: true,
  });

  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill on edit
  useEffect(() => {
    if (isEditMode && blog) {
      setFormData({
        title: blog.title || "",
        category: blog.category || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        author: blog.author || "",
        status: blog.status ?? true,
      });
      if (blog.coverImage) setCoverPreview(blog.coverImage);
    }
  }, [isEditMode, blog]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const required = ["title", "category", "excerpt", "content", "author"];
    const missing = required.filter((f) => !formData[f]?.trim());
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (coverFile) fd.append("coverImage", coverFile);

      if (isEditMode) {
        await updateBlog(blog._id, fd);
        toast.success("Blog updated successfully!");
      } else {
        await createBlog(fd);
        toast.success("Blog created successfully!");
      }
      navigate("/blog");
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/blog")}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Edit Blog Post" : "Add New Blog Post"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cover Image */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-700 mb-3">
              Cover Image
            </h2>
            {coverPreview ? (
              <div className="relative">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="h-52 w-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeCover}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="coverImage"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl h-40 cursor-pointer hover:border-[#A2BF90] transition-colors"
              >
                <FaUpload className="text-gray-300 mb-2" size={28} />
                <p className="text-gray-400 text-sm">Click to upload cover image</p>
                <p className="text-gray-300 text-xs mt-1">PNG, JPG, WEBP up to 10MB</p>
              </label>
            )}
            <input
              id="coverImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </div>

          {/* Blog Details */}
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
            <h2 className="text-base font-semibold text-gray-700">
              Blog Details
            </h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                id="blog-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2BF90]"
              />
              {formData.title && (
                <p className="text-xs text-gray-400 mt-1">
                  Slug: /
                  {formData.title
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .trim()
                    .replace(/\s+/g, "-")}
                </p>
              )}
            </div>

            {/* Category + Author Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  id="blog-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2BF90]"
                >
                  <option value="">Select category</option>
                  {BLOG_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Author <span className="text-red-400">*</span>
                </label>
                <input
                  id="blog-author"
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Author name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2BF90]"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Excerpt (short summary) <span className="text-red-400">*</span>
              </label>
              <textarea
                id="blog-excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                placeholder="Brief description shown in blog listing..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2BF90] resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Content <span className="text-red-400">*</span>
              </label>
              <textarea
                id="blog-content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={12}
                placeholder="Write the full blog content here..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2BF90] resize-y"
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.content.length} characters
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <input
                id="blog-status"
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="w-4 h-4 accent-[#A2BF90]"
              />
              <label
                htmlFor="blog-status"
                className="text-sm font-medium text-gray-600"
              >
                Published (visible to users)
              </label>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate("/blog")}
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              id="submit-blog-btn"
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#A2BF90] hover:bg-[#8aab74] text-white rounded-lg text-sm font-medium disabled:opacity-60 transition-colors"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Publishing..."
                : isEditMode
                ? "Update Blog"
                : "Publish Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
