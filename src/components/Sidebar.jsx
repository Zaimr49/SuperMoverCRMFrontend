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
            <a href="/dashboard" className="flex items-center p-3 text-sm rounded-lg bg-blue-600 text-white font-semibold">
              <FaChartLine className="mr-3" />
              Lead Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-3 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <FiTrendingUp className="mr-3" />
              Lead Status Management
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-3 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <FiLogIn className="mr-3" />
              Sale Sign Up
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-3 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <FiUsers className="mr-3" />
              Sales & Reporting
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-3 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <FaUserCog className="mr-3" />
              User Access Settings
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
