import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaCalendar,
  FaUser,
  FaShoppingCart,
  FaTasks,
  FaCalendarAlt,
  FaNewspaper,
} from "react-icons/fa";
import { FaBarsProgress, FaFilter  } from "react-icons/fa6";

const Sidebar = ({ isCollapsed }) => {
  const menuItems = [
    // { icon: FaHome, label: "Dashboard", path: "/" },
    { icon: FaCalendar, label: "Products", path: "/products" },
    { icon: FaTasks, label: "Categories", path: "/categories" },
    { icon: FaUser, label: "SubCategory", path: "/subcategory" },
    // { icon: FaFilter , label: "Filter", path: "/filter" },
    { icon: FaShoppingCart, label: "Book Products", path: "/orders" },
    { icon: FaCalendarAlt, label: "Events", path: "/events" },
    { icon: FaNewspaper, label: "Blog", path: "/blog" },
    // { icon: FaShoppingCart, label: "GiftBox & Combo", path: "/combo" },
    // { icon: FaBarsProgress, label: "Help & Support", path: "/help" },
    { icon: FaBarsProgress, label: "Contact", path: "/contact" },
  ];

  return (
    <div
      className={`bg-[#ffffff] shadow-md text-black h-screen p-1 transition-[width] duration-500 ease-in-out hidden lg:block ${
        isCollapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Logo Section */}
      <div className="sticky top-0 bg-white z-10 pt-1">
       

        <h1 className="text-xl font-bold flex items-center space-x-2 p-2">
          <img
              src="/logo.png"
              alt="Admin Logo"
              className={`h-20 w-55 object-cover ${
                isCollapsed ? "h-8 w-8" : ""
              }`}
            />
        </h1>
      </div>

      {/* Menu Section */}
      {/* <div className="mt-6">
        <p
          className={`text-gray-500 uppercase text-sm ml-3 transition-[max-width,opacity] duration-500 ease-in-out ${
            isCollapsed ? "max-w-0 opacity-0" : "max-w-full opacity-100"
          } whitespace-nowrap`}
        >
          Menu
        </p>
      </div> */}

      {/* Apps Section */}
      <div className="mt-4">
        <div className="space-y-2">
          {menuItems.map(({ icon: Icon, label, path }, index) => (
            <NavLink
              to={path}
              key={index}
              className={({ isActive }) =>
                `flex items-center w-full py-2 px-3 rounded transition-all duration-500 ${
                  isActive ? "bg-[#A2BF90] text-white" : "hover:bg-[#EDEDE3] "
                }`
              }
            >
              <Icon className="mr-3 min-w-[20px]" />
              <span
                className={`overflow-hidden transition-[max-width,opacity] duration-500 ease-in-out ${
                  isCollapsed ? "max-w-0 opacity-0" : "max-w-full opacity-100"
                } whitespace-nowrap`}
              >
                {label}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;