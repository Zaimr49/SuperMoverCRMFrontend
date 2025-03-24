import { NavLink } from "react-router-dom";
import { FaChartLine, FaUserCog } from "react-icons/fa";
import { FiTrendingUp, FiUsers, FiLogIn } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import superMoverLogo from "../assets/loginSuperMoverLogo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: <FaChartLine className="mr-3" />, label: "Lead Dashboard",disable: false },
    { path: "/lead-status", icon: <FiTrendingUp className="mr-3" />, label: "Lead Status Management",disable: true },
    { path: "/sale-signup", icon: <FiLogIn className="mr-3" />, label: "Sale Sign Up",disable: true },
    { path: "/sales-and-reporting", icon: <FiUsers className="mr-3" />, label: "Sales & Reporting",disable: false },
    { path: "/user-access-settings", icon: <FaUserCog className="mr-3" />, label: "User Access Settings", disable: false },
  ];

  return (
    <aside className="w-full md:w-72 bg-white shadow-md p-5">
      <div className="flex justify-between items-center mb-6">
        <img
          src={superMoverLogo}
          onClick={() => navigate('/')}
          alt="Super Mover Logo"
          className="h-28 w-auto cursor-pointer"
        />
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <a
                href={item.disable ? '#' : item.path}
                className={`flex items-center p-3 text-sm rounded-lg font-semibold ${
                  location.pathname === item.path ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;