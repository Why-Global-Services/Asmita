import { useEffect, useRef, useState } from "react";
import {
  Copy,
  ShieldCheck,
  Trash2,
  Ban,
  Key,
  User,
  Edit2,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getProfile } from "../Interceptor/interceptor";
import { updateProfile, changePassword } from "../Interceptor/interceptor";

export default function Profile() {
  // --- State ---
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phoneNumber: "",
    id: "",
    password: "",
    profileImage: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // --- Fetch profile ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        const data = profileData?.data?.data || {};

        const nameParts = data.name ? data.name.split(" ") : ["", ""];

        setFormData({
          firstName: nameParts[0] || "",
          lastName: nameParts[1] || "",
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          id: data._id || "",
          password: data.password || "",
          profileImage: data.profileImage || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  // --- Image Upload Handler ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));

      // OPTIONAL: If you want to upload to server, you can handle that here
      // const formData = new FormData();
      // formData.append("profileImage", file);
      // await uploadProfileImage(formData);
    }
  };

  // --- Save Handler ---
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // --- Password Change Handler ---
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(passwordData);
      toast.success("Password updated successfully!");
      setShowPasswordModal(false);
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      toast.error("Error changing password");
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/4 bg-white shadow rounded-2xl p-6 flex flex-col items-center">
        <div
          className="cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          <img
            src={
              formData.profileImage ||
              "https://media.istockphoto.com/id/2221915585/vector/grey-avatar-icon-user-avatar-photo-icon-social-media-user-icon-vector.jpg?s=612x612&w=0&k=20&c=9CObBqL8r65oVfHE4hyEqpyb8FwK7VfDqF1qXD5YMz4="
            }
            alt="Profile"
            className="w-24 h-24 rounded-full border object-cover"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <h2 className="mt-4 text-sm font-medium text-gray-700">
          {formData.email || ""}
        </h2>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 flex flex-col gap-6">
        <div className="bg-white shadow rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            {isEditing ? (
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg text-sm disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {loading ? "Saving..." : "Save"}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
              >
                <Edit2 className="h-4 w-4" /> Edit
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">First Name</label>
              <input
                value={formData.firstName || ""}
                readOnly={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full border rounded p-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Last Name</label>
              <input
                value={formData.lastName || ""}
                readOnly={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full border rounded p-2 bg-gray-50"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500">Email Address</label>
              <div className="flex items-center gap-2">
                <input
                  value={formData.email || ""}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border rounded p-2 bg-gray-50"
                />
                <span className="flex items-center text-green-600 text-xs">
                  <ShieldCheck className="h-4 w-4 mr-1" /> Verified
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500">Phone Number</label>
              <div className="flex items-center gap-2">
                <input
                  value={formData.phoneNumber || ""}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full border rounded p-2 bg-gray-50"
                />
                <span className="flex items-center text-green-600 text-xs">
                  <ShieldCheck className="h-4 w-4 mr-1" /> Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Old Password"
                value={passwordData.oldPassword || ""}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                className="w-full border rounded p-2"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword || ""}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full border rounded p-2"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={passwordData.confirmPassword || ""}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full border rounded p-2"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
              >
                {passwordLoading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
