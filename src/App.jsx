import { useState } from "react";
import { Toaster } from "sonner";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Sidebar from "./Common/Sidebar";
import Navbar from "./Common/Navbar";
import ProductMain from "./Product/ProductMain";
import ProductForm from "./Product/ProductForm";
import CategoryForm from "./Category/CategoryForm";
import CategoryMain from "./Category/CategoryMain";
import OrderMain from "./Order/OrderMain";
import Login from "./Common/Login";
import ContactEnquiryTable from "./Contact/contactTable";
import ContactMain from "./Contact/contactMain";
import SubCategoryMain from "./SubCategory/SubCategoryMain";
import SubcategoryForm from "./SubCategory/SubCategoryForm";
import Profile from "./profile/Profile";
import FilterMain from "./Filter/FilterMain";
import FilterForm from "./Filter/FilterForm";
import EventMain from "./Events/EventMain";
import EventForm from "./Events/EventForm";
import BlogMain from "./Blog/BlogMain";
import BlogForm from "./Blog/BlogForm";

// Component to protect routes and include layout
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return isAuthenticated ? (
    <div className="flex h-screen overflow-y-hidden">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden-1">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-0 mt-0">{children}</main>
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
};

// Public login route that redirects if already authenticated
const LoginRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/products" replace /> : <Login />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Root route redirects based on auth */}
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/products" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Public route for login, redirects if authenticated */}
        <Route path="/login" element={<LoginRoute />} />
        {/* Protected routes */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/productadd"
          element={
            <ProtectedRoute>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/productedit"
          element={
            <ProtectedRoute>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoryMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories/categoryadd"
          element={
            <ProtectedRoute>
              <CategoryForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories/categoryedit"
          element={
            <ProtectedRoute>
              <CategoryForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subcategory"
          element={
            <ProtectedRoute>
              <SubCategoryMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subcategories/subcategoryadd"
          element={
            <ProtectedRoute>
              <SubcategoryForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subcategories/subcategoryedit"
          element={
            <ProtectedRoute>
              <SubcategoryForm />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/filter"
          element={
            <ProtectedRoute>
              <FilterMain/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/filter/filteradd"
          element={
            <ProtectedRoute>
              <FilterForm/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/filter/filteredit"
          element={
            <ProtectedRoute>
              <FilterForm/>
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <ContactMain />
            </ProtectedRoute>
          }
        />
        {/* Events */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/eventadd"
          element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/eventedit"
          element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          }
        />
        {/* Blog */}
        <Route
          path="/blog"
          element={
            <ProtectedRoute>
              <BlogMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog/blogadd"
          element={
            <ProtectedRoute>
              <BlogForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog/blogedit"
          element={
            <ProtectedRoute>
              <BlogForm />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" richColors />
    </Router>
  );
}

export default App;