import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUpload, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { createEvent, updateEvent } from "../Interceptor/interceptor";

const EVENT_TYPES = [
  "Health Camp",
  "Webinar",
  "Workshop",
  "Conference",
  "Awareness Program",
];

const EventForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { event, mode } = location.state || {};
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    status: true,
  });

  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill on edit
  useEffect(() => {
    if (isEditMode && event) {
      const dateStr = event.eventDate
        ? new Date(event.eventDate).toISOString().split("T")[0]
        : "";
      setFormData({
        title: event.title || "",
        description: event.description || "",
        eventType: event.eventType || "",
        eventDate: dateStr,
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        location: event.location || "",
        status: event.status ?? true,
      });
      if (event.bannerImage) setBannerPreview(event.bannerImage);
    }
  }, [isEditMode, event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate required
    const required = ["title", "description", "eventType", "eventDate", "startTime", "endTime", "location"];
    const missing = required.filter((f) => !formData[f]);
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (bannerFile) fd.append("bannerImage", bannerFile);

      if (isEditMode) {
        await updateEvent(event._id, fd);
        toast.success("Event updated successfully!");
      } else {
        await createEvent(fd);
        toast.success("Event created successfully!");
      }
      navigate("/events");
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
            onClick={() => navigate("/events")}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Edit Event" : "Add New Event"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Banner Image Upload */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-700 mb-3">
              Banner Image
            </h2>
            {bannerPreview ? (
              <div className="relative inline-block">
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="h-48 w-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeBanner}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="bannerImage"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl h-40 cursor-pointer hover:border-[#A2BF90] transition-colors"
              >
                <FaUpload className="text-gray-300 mb-2" size={28} />
                <p className="text-gray-400 text-sm">Click to upload banner image</p>
                <p className="text-gray-300 text-xs mt-1">PNG, JPG, WEBP up to 10MB</p>
              </label>
            )}
            <input
              id="bannerImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerChange}
            />
          </div>

          {/* Event Details */}
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
            <h2 className="text-base font-semibold text-gray-700">
              Event Details
            </h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Event Title <span className="text-red-400">*</span>
              </label>
              <input
                id="event-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2BF90]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="event-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the event..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2BF90] resize-none"
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Event Type <span className="text-red-400">*</span>
              </label>
              <select
                id="event-type"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2BF90]"
              >
                <option value="">Select event type</option>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Date + Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Event Date <span className="text-red-400">*</span>
                </label>
                <input
                  id="event-date"
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2BF90]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Start Time <span className="text-red-400">*</span>
                </label>
                <input
                  id="event-start-time"
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2BF90]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  End Time <span className="text-red-400">*</span>
                </label>
                <input
                  id="event-end-time"
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2BF90]"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                id="event-location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., City Hall, Mumbai"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2BF90]"
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <input
                id="event-status"
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="w-4 h-4 accent-[#A2BF90]"
              />
              <label
                htmlFor="event-status"
                className="text-sm font-medium text-gray-600"
              >
                Active (visible to users)
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
              onClick={() => navigate("/events")}
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              id="submit-event-btn"
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#A2BF90] hover:bg-[#8aab74] text-white rounded-lg text-sm font-medium disabled:opacity-60 transition-colors"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Event"
                : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
