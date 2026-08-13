import { useState, useRef, useEffect } from "react";
import {
  FaBars,
  FaBell,
  FaCog,
  FaHome,
  FaCalendar,
  FaUser,
  FaShoppingCart,
  FaTasks,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      name: "Ronald Richards",
      message: "Your profile has been verified.",
      time: "23 mins ago",
      img: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "Arlene McCoy",
      message: "You can stitch between multiple videos.",
      time: "23 mins ago",
      img: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: 3,
      name: "Annette Black",
      message: "Invited you to prototyping.",
      time: "23 mins ago",
      img: "https://randomuser.me/api/portraits/women/3.jpg",
    },
  ]);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { icon: FaHome, label: "Dashboard", path: "/products" }, // Updated path to /products
    { icon: FaCalendar, label: "Products", path: "/products" },
    { icon: FaTasks, label: "Categories", path: "/categories" },
    { icon: FaShoppingCart, label: "Orders", path: "/orders" },
    { icon: FaUser, label: "Users", path: "/users" },
    { icon: FaShoppingCart, label: "GiftBox & Combo", path: "/combo" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div>
      <div className="flex items-center justify-between bg-[#f0ffe6] p-4 shadow-md mb-0.5">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* For large screens */}
          <FaBars
            className="text-gray-600 text-xl cursor-pointer hidden lg:block"
            onClick={toggleSidebar}
          />
          <div className="ml-6 hidden lg:block">
            Hi! Have a great day..{" "}
            {/* <span className="text-2xl font-semibold ml-1">Sai Sudarson</span> */}
          </div>
          {/* For small and medium screens */}
          <FaBars
            className="text-gray-600 text-xl cursor-pointer block lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Notification Bell */}
          {/* <div className="relative cursor-pointer mr-10" ref={notificationRef}>
            <motion.div
              animate={{ rotate: [0, -15, 15, -15, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.5,
                ease: "easeInOut",
              }}
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <FaBell className="text-gray-600 text-xl" />
            </motion.div>
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full">
                {notifications.length}
              </span>
            )}

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-sm border border-gray-200 z-50">
                <div className="pb-2 pt-4 flex justify-between px-5 border-b border-gray-400">
                  <h3 className="text-lg font-bold text-blue-500">
                    Notifications
                  </h3>
                  <button
                    className="text-sm font-medium underline text-gray-500"
                    onClick={() => setNotifications([])}
                  >
                    Clear All
                  </button>
                </div>
                <ul className="py-2">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <li
                        key={notif.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={notif.img}
                            alt="User"
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium">{notif.name}</p>
                            <p className="text-xs text-gray-500">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-center py-4 text-gray-500">
                      0 Notifications
                    </p>
                  )}
                </ul>
                <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                  <Link
                    to="/notifications"
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    See All Notifications <IoIosArrowForward className="ml-2" />
                  </Link>
                </div>
              </div>
            )}
          </div> */}

          {/* Profile Dropdown */}
          <div className="relative mr-5" ref={dropdownRef}>
            <div
              className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              <img
                src="/icon.png"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-600 font-medium">Sai Sudarson</span>
              <IoIosArrowDown className="text-gray-500 transition-transform duration-200" />
            </div>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-24 bg-white shadow-lg rounded-md border z-50">
                <ul className="py-2">
                  {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <Link
                      to="/profile"
                      className="block w-full h-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                  </li> */}
                  <li
                    className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Settings Icon */}
          {/* <FaCog className="text-gray-600 text-xl cursor-pointer mr-3 animate-spin" /> */}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-transparent z-50 lg:hidden">
          <div className="w-64 bg-gray-900 text-white h-full p-4 absolute left-0 top-0">
            <button
              className="text-white text-2xl absolute top-4 right-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              &times;
            </button>
            <div className="mt-10">
              {menuItems.map(({ icon: Icon, label, path }, index) => (
                <NavLink
                  to={path}
                  key={index}
                  className={({ isActive }) =>
                    `flex items-center py-2 px-3 rounded transition-all duration-300 ${
                      isActive ? "bg-blue-600" : "hover:bg-gray-800"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="mr-3 min-w-[20px]" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;