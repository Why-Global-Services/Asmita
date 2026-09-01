import axios from "axios";
import { toast } from "react-toastify";

const apiInstance = axios.create({
  baseURL: "http://localhost:5003/v1/admin",
  // baseURL: "https://theerahapi.whydev.in/v1/admin",
});

// Handle token expiration
const handleTokenExpiration = () => {
  console.error("Token expired or invalid, logging out...");
  localStorage.removeItem("token");
  toast.error("Your session has expired or is invalid. Please log in again.");
  setTimeout(() => {
    window.location.href = "/";
  }, 1500);
};

apiInstance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("token");
    if (authToken && authToken !== "undefined" && authToken !== "null") {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error Interceptor:", error);
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => {
    if (response.data?.accessToken) {
      localStorage.setItem("token", response.data.accessToken); // Store accessToken
    }
    return response;
  },
  (error) => {
    const errorMessage =
      error?.response?.data?.message || error?.response?.data?.status;
    const statusCode = error?.response?.status;

    if (
      statusCode === 401 ||
      (statusCode === 403 && (errorMessage === "Invalid or expired token" || errorMessage === "No token provided" || errorMessage === "Unauthorized")) ||
      errorMessage === "Token expired" ||
      errorMessage === "Invalid or expired token" ||
      errorMessage === "No token provided"
    ) {
      handleTokenExpiration();
    } else if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.error("Something went wrong!");
    }

    return Promise.reject(error);
  }
);

export default apiInstance;

/* ------------------ AUTH ------------------ */
export const adminLogin = async (data) => {
  const res = await apiInstance.post(`/login`, data);
  if (res.data.accessToken) {
    localStorage.setItem("token", res.data.accessToken);
  } else {
    console.error("No accessToken found in response");
  }
  return res;
};

/* ------------------ PROFILE ------------------ */
export const getProfile = async () => {
  const res = await apiInstance.get(`/getProfile`);
  return res;
};

export const updateProfile = async (data) => {
  const res = await apiInstance.patch(`/getProfile`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res;
};

export const changePassword = async (data) => {
  // data = { oldPassword, newPassword, confirmPassword }
  const res = await apiInstance.post(`/change-password`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res;
};

/* ------------------ PRODUCTS ------------------ */
export const getProduct = async () => {
  const res = await apiInstance.get(`/getProduct`);
  return res;
};

export const createProduct = async (data) => {
  const res = await apiInstance.post(`/createProduct`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const updateProduct = async (id, data) => {
  const res = await apiInstance.put(`/updateProduct/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const deleteProduct = async (id) => {
  const res = await apiInstance.delete(`/deleteProduct/${id}`);
  return res;
};

/* ------------------ CATEGORIES ------------------ */
export const getCategories = async () => {
  const res = await apiInstance.get(`/getCategory`);
  return res;
};

export const createCategory = async (data) => {
  const res = await apiInstance.post(`/createCategory`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const editCategory = async (data, id) => {
  const res = await apiInstance.put(`/updateCategory/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const deleteCategory = async (id) => {
  const res = await apiInstance.delete(`/deleteCategory/${id}`, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const getBookedProducts = async () => {
  const res = await apiInstance.get(`/getBookedProducts`);
  return res;
};

/* ------------------ SUB-CATEGORIES ------------------ */
export const getSubCategories = async () => {
  const res = await apiInstance.get(`/getSubCategory`);
  return res;
};

export const createSubCategory = async (data) => {
  const res = await apiInstance.post(`/createSubCategory`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const editSubCategory = async (id, data) => {
  const res = await apiInstance.put(`/updatesubCategory/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const deleteSubCategory = async (id) => {
  const res = await apiInstance.delete(`/deleteSubCategory/${id}`, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};



/* ------------------ Filter ------------------ */
export const getFilter = async () => {
  const res = await apiInstance.get(`/getFilter`);
  return res;
};

export const createFilter = async (data) => {
  const res = await apiInstance.post(`/createFilter`, data );
  return res;
};

export const editFilter = async (id, data) => {
  const res = await apiInstance.put(`/updatefilter/${id}`, data, );
  return res;
};

export const deleteFilter = async (id) => {
  const res = await apiInstance.delete(`/deleteFilter/${id}`, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};


/* ------------------ CONTACT ------------------ */
export const getContact = async () => {
  const res = await apiInstance.get(`/getContact`);
  return res;
};

export const deleteBookedProduct = async (id) => {
  const res = await apiInstance.delete(`/deleteBookedProduct/${id}`, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};


/* ------------------ EVENTS ------------------ */
export const getEvents = async () => {
  const res = await apiInstance.get(`/getEvents`);
  return res;
};

export const createEvent = async (data) => {
  const res = await apiInstance.post(`/createEvent`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const updateEvent = async (id, data) => {
  const res = await apiInstance.put(`/updateEvent/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const deleteEvent = async (id) => {
  const res = await apiInstance.delete(`/deleteEvent/${id}`);
  return res;
};


/* ------------------ BLOG ------------------ */
export const getBlogs = async () => {
  const res = await apiInstance.get(`/getBlogs`);
  return res;
};

export const createBlog = async (data) => {
  const res = await apiInstance.post(`/createBlog`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const updateBlog = async (id, data) => {
  const res = await apiInstance.put(`/updateBlog/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const deleteBlog = async (id) => {
  const res = await apiInstance.delete(`/deleteBlog/${id}`);
  return res;
};
