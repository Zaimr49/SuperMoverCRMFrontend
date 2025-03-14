import { NavLink } from "react-router-dom";
import { FaChartLine, FaUserCog } from "react-icons/fa";
import { FiTrendingUp, FiUsers, FiLogIn } from "react-icons/fi";
import superMoverLogo from "../assets/loginSuperMoverLogo.png";

const Sidebar = () => {
  return (
    <aside className="w-full md:w-72 bg-white shadow-md p-5">
      <div className="flex justify-between items-center mb-6">
        <img src={superMoverLogo} alt="Super Mover Logo" className="h-28 w-auto" />
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center p-3 text-sm rounded-lg ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <FaChartLine className="mr-3" />
              Lead Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/#"
              className={({ isActive }) =>
                `flex items-center p-3 text-sm rounded-lg ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <FiTrendingUp className="mr-3" />
              Lead Status Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/#"
              className={({ isActive }) =>
                `flex items-center p-3 text-sm rounded-lg ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <FiLogIn className="mr-3" />
              Sale Sign Up
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/sales-dashboard"
              className={({ isActive }) =>
                `flex items-center p-3 text-sm rounded-lg ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <FiUsers className="mr-3" />
              Sales & Reporting
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/#"
              className={({ isActive }) =>
                `flex items-center p-3 text-sm rounded-lg ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <FaUserCog className="mr-3" />
              User Access Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
