import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import { Modal, Switch, Tooltip } from "antd";
import { toast } from "sonner";
import { getBlogs, deleteBlog, updateBlog } from "../Interceptor/interceptor";

const BlogTable = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [viewBlog, setViewBlog] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await getBlogs();
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setBlogs(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    let data = [...blogs];
    if (activeTab === "active") data = data.filter((b) => b.status);
    if (activeTab === "inactive") data = data.filter((b) => !b.status);
    if (searchTerm.trim())
      data = data.filter(
        (b) =>
          b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFiltered(data);
    setCurrentPage(1);
  }, [blogs, activeTab, searchTerm]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDelete = async () => {
    try {
      await deleteBlog(blogToDelete._id);
      toast.success("Blog deleted successfully");
      setShowDeleteModal(false);
      fetchBlogs();
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  const handleToggleStatus = async (bl) => {
    try {
      const formData = new FormData();
      formData.append("status", !bl.status);
      await updateBlog(bl._id, formData);
      toast.success(`Blog ${!bl.status ? "published" : "unpublished"}`);
      fetchBlogs();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blog Posts</h1>
        <button
          id="add-blog-btn"
          onClick={() => navigate("/blog/blogadd")}
          className="flex items-center gap-2 bg-[#A2BF90] hover:bg-[#8aab74] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <FaPlus />
          Add Blog
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <input
          id="blog-search"
          type="text"
          placeholder="Search by title, category, or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2BF90] w-72"
        />
      </div>

      {/* Tabs + Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {["all", "active", "inactive"].map((tab) => (
            <button
              key={tab}
              id={`blog-tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-[#A2BF90] text-[#A2BF90]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-400">
            Loading blogs...
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex justify-center items-center py-20 text-gray-400">
            No blog posts found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Cover</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Author</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Slug</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((bl, idx) => (
                  <tr key={bl._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">
                      {(currentPage - 1) * rowsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      {bl.coverImage ? (
                        <img
                          src={bl.coverImage}
                          alt={bl.title}
                          className="h-10 w-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-10 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-300 text-xs">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px] truncate">
                      {bl.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {bl.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{bl.author}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(bl.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-[120px] truncate">
                      /{bl.slug}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Switch
                        checked={bl.status}
                        onChange={() => handleToggleStatus(bl)}
                        size="small"
                        style={{
                          backgroundColor: bl.status ? "#A2BF90" : undefined,
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip title="View">
                          <button
                            id={`view-blog-${bl._id}`}
                            onClick={() => {
                              setViewBlog(bl);
                              setShowViewModal(true);
                            }}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FaEye size={14} />
                          </button>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <button
                            id={`edit-blog-${bl._id}`}
                            onClick={() =>
                              navigate("/blog/blogedit", {
                                state: { blog: bl, mode: "edit" },
                              })
                            }
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <FaEdit size={14} />
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <button
                            id={`delete-blog-${bl._id}`}
                            onClick={() => {
                              setBlogToDelete(bl);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FaTrashAlt size={14} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * rowsPerPage + 1}–
              {Math.min(currentPage * rowsPerPage, filtered.length)} of{" "}
              {filtered.length} posts
            </p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1 rounded text-sm ${
                    p === currentPage
                      ? "bg-[#A2BF90] text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        footer={null}
        centered
        width={400}
      >
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrashAlt className="text-red-500" size={22} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Delete Blog Post?
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Are you sure you want to delete{" "}
            <strong>{blogToDelete?.title}</strong>? This cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-5 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              id="confirm-delete-blog"
              onClick={handleDelete}
              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={showViewModal}
        onCancel={() => setShowViewModal(false)}
        footer={null}
        centered
        width={600}
      >
        {viewBlog && (
          <div className="py-2">
            {viewBlog.coverImage && (
              <img
                src={viewBlog.coverImage}
                alt={viewBlog.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-2 inline-block">
              {viewBlog.category}
            </span>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {viewBlog.title}
            </h2>
            <p className="text-gray-400 text-xs mb-2">
              By <strong>{viewBlog.author}</strong> ·{" "}
              {formatDate(viewBlog.createdAt)} · /{viewBlog.slug}
            </p>
            <p className="text-gray-600 text-sm mb-3 italic">{viewBlog.excerpt}</p>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-gray-700 text-sm whitespace-pre-wrap line-clamp-6">
                {viewBlog.content}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BlogTable;
