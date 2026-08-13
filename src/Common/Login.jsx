import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaArrowRight, FaSpinner } from "react-icons/fa";
import { adminLogin } from "../Interceptor/interceptor";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await adminLogin(formData);
      if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken); // Store accessToken
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate("/products"); // Redirect to products table page
        }, 1000);
      } else {
        throw new Error("No accessToken received from server");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-pink-300 via-purple-400 to-pink-500 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm bg-transparent backdrop-blur-lg rounded-3xl p-8 pt-20 shadow-2xl border-2 border-white/20"
      >
        {/* Top User Icon with gradient */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-pink-600 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center shadow-xl border-4 border-white/20">
          <FaUser className="text-white text-3xl" />
        </div>

        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Welcome Back
        </h2>

        {/* Error message */}
        {error && (
          <div className="mb-4 text-red-200 text-sm bg-red-900/30 px-4 py-2 rounded-lg border border-red-400/50">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-4 text-green-200 text-sm bg-green-900/30 px-4 py-2 rounded-lg border border-green-400/50">
            Login successful! Redirecting to products...
          </div>
        )}

        {/* Email Field */}
        <div className="flex items-center bg-white/10 text-white px-4 py-3 rounded-lg mb-4 shadow-sm border border-white/15 transition-all focus-within:border-white/40">
          <FaUser className="mr-3 text-sm opacity-80" />
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            className="bg-transparent outline-none placeholder-white/80 text-sm w-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex items-center bg-white/10 text-white px-4 py-3 rounded-lg mb-1 shadow-sm border border-white/15 transition-all focus-within:border-white/40">
          <FaLock className="mr-3 text-sm opacity-80" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="bg-transparent outline-none placeholder-white/80 text-sm w-full"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r text-white cursor-pointer from-pink-600 to-purple-600 font-medium py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group disabled:opacity-70"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              <span>LOGGING IN...</span>
            </>
          ) : (
            <>
              <span>LOGIN</span>
              <FaArrowRight className="ml-2 text-xs text-white opacity-0 group-hover:opacity-100 group-hover:ml-3 transition-all duration-300" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
