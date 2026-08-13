import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import { Modal, Switch, Tooltip } from "antd";
import { toast } from "sonner";
import { getEvents, deleteEvent, updateEvent } from "../Interceptor/interceptor";

const EVENT_TYPES = [
  "All",
  "Health Camp",
  "Webinar",
  "Workshop",
  "Conference",
  "Awareness Program",
];

const EventTable = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [viewEvent, setViewEvent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getEvents();
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setEvents(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let data = [...events];
    if (activeTab === "active") data = data.filter((e) => e.status);
    if (activeTab === "inactive") data = data.filter((e) => !e.status);
    if (selectedType !== "All")
      data = data.filter((e) => e.eventType === selectedType);
    if (searchTerm.trim())
      data = data.filter(
        (e) =>
          e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFiltered(data);
    setCurrentPage(1);
  }, [events, activeTab, selectedType, searchTerm]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDelete = async () => {
    try {
      await deleteEvent(eventToDelete._id);
      toast.success("Event deleted successfully");
      setShowDeleteModal(false);
      fetchEvents();
    } catch {
      toast.error("Failed to delete event");
    }
  };

  const handleToggleStatus = async (ev) => {
    try {
      const formData = new FormData();
      formData.append("status", !ev.status);
      await updateEvent(ev._id, formData);
      toast.success(`Event ${!ev.status ? "activated" : "deactivated"}`);
      fetchEvents();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const typeColors = {
    "Health Camp": "bg-green-100 text-green-700",
    Webinar: "bg-blue-100 text-blue-700",
    Workshop: "bg-yellow-100 text-yellow-700",
    Conference: "bg-purple-100 text-purple-700",
    "Awareness Program": "bg-pink-100 text-pink-700",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Events</h1>
        <button
          id="add-event-btn"
          onClick={() => navigate("/events/eventadd")}
          className="flex items-center gap-2 bg-[#A2BF90] hover:bg-[#8aab74] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <FaPlus />
          Add Event
        </button>
      </div>

      {/* Filters Row */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center justify-between">
        <input
          id="event-search"
          type="text"
          placeholder="Search by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2BF90] w-64"
        />
        <select
          id="event-type-filter"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2BF90]"
        >
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {["all", "active", "inactive"].map((tab) => (
            <button
              key={tab}
              id={`tab-${tab}`}
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

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-400">
            Loading events...
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex justify-center items-center py-20 text-gray-400">
            No events found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Banner</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((ev, idx) => (
                  <tr key={ev._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">
                      {(currentPage - 1) * rowsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      {ev.bannerImage ? (
                        <img
                          src={ev.bannerImage}
                          alt={ev.title}
                          className="h-10 w-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-10 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-300 text-xs">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px] truncate">
                      {ev.title}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          typeColors[ev.eventType] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {ev.eventType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(ev.eventDate)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {ev.startTime} – {ev.endTime}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">
                      {ev.location}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Switch
                        checked={ev.status}
                        onChange={() => handleToggleStatus(ev)}
                        size="small"
                        style={{
                          backgroundColor: ev.status ? "#A2BF90" : undefined,
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip title="View">
                          <button
                            id={`view-event-${ev._id}`}
                            onClick={() => {
                              setViewEvent(ev);
                              setShowViewModal(true);
                            }}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FaEye size={14} />
                          </button>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <button
                            id={`edit-event-${ev._id}`}
                            onClick={() =>
                              navigate("/events/eventedit", {
                                state: { event: ev, mode: "edit" },
                              })
                            }
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <FaEdit size={14} />
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <button
                            id={`delete-event-${ev._id}`}
                            onClick={() => {
                              setEventToDelete(ev);
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
              {filtered.length} events
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
            Delete Event?
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Are you sure you want to delete{" "}
            <strong>{eventToDelete?.title}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-5 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              id="confirm-delete-event"
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
        width={520}
      >
        {viewEvent && (
          <div className="py-2">
            {viewEvent.bannerImage && (
              <img
                src={viewEvent.bannerImage}
                alt={viewEvent.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium mb-2 inline-block ${
                typeColors[viewEvent.eventType] || "bg-gray-100 text-gray-600"
              }`}
            >
              {viewEvent.eventType}
            </span>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {viewEvent.title}
            </h2>
            <p className="text-gray-500 text-sm mb-3">{viewEvent.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Date:</span>{" "}
                {formatDate(viewEvent.eventDate)}
              </div>
              <div>
                <span className="font-medium">Time:</span>{" "}
                {viewEvent.startTime} – {viewEvent.endTime}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Location:</span>{" "}
                {viewEvent.location}
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={viewEvent.status ? "text-green-600" : "text-red-500"}
                >
                  {viewEvent.status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventTable;
