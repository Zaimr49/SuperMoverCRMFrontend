import React, { useState, useEffect } from "react";
import { FiSearch, FiEdit2, FiUsers, FiMoreVertical } from "react-icons/fi";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

// Hard-coded fallback data:
const defaultRoles = [
  {
    id: 1,
    firstName: "John",
    lastName: "Smith",
    role: "Lead Manager",
    users: 1,
    lastUpdated: "June 5, 2023, 4:36 PM",
    createdBy: "John Smith",
    phone: "123-456-7890",
    mobile: "987-654-3210",
    email: "john.smith@example.com",
    position: "Lead Manager",
    category: "Management",
    avatar: "https://randomuser.me/api/portraits/men/30.jpg",
  },
  {
    id: 2,
    firstName: "Charlotte",
    lastName: "R.",
    role: "Sales Manager",
    users: 1,
    lastUpdated: "Sep 16, 2023, 3:45 PM",
    createdBy: "Charlotte R.",
    phone: "123-555-7890",
    mobile: "987-555-3210",
    email: "charlotte.r@example.com",
    position: "Sales Manager",
    category: "Sales",
    avatar: "https://randomuser.me/api/portraits/women/31.jpg",
  },
  {
    id: 3,
    firstName: "Sarah",
    lastName: "Johnson",
    role: "Sales & Lead Team",
    users: 7,
    lastUpdated: "Sep 16, 2023, 5:25 PM",
    createdBy: "Sarah J.",
    phone: "111-222-3333",
    mobile: "999-888-7777",
    email: "sarah.j@example.com",
    position: "Sales & Lead Team",
    category: "Sales",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: 4,
    firstName: "David",
    lastName: "West",
    role: "Finance Manager",
    users: 1,
    lastUpdated: "Oct 18, 2023, 3:20 PM",
    createdBy: "David West",
    phone: "444-555-6666",
    mobile: "666-555-4444",
    email: "david.west@example.com",
    position: "Finance Manager",
    category: "Finance",
    avatar: "https://randomuser.me/api/portraits/men/50.jpg",
  },
  {
    id: 5,
    firstName: "Robert",
    lastName: "M.",
    role: "Operations Manager",
    users: 1,
    lastUpdated: "Oct 03, 2023, 6:25 PM",
    createdBy: "Robert M.",
    phone: "777-888-9999",
    mobile: "888-777-6666",
    email: "robert.m@example.com",
    position: "Operations Manager",
    category: "Operations",
    avatar: "https://randomuser.me/api/portraits/men/48.jpg",
  },
];

const UserAccessSettings = () => {
  // State to hold roles fetched from API (or fallback data).
  const [roles, setRoles] = useState([]);
  // For search input
  const [searchTerm, setSearchTerm] = useState("");
  // For "select all" checkbox
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  // Simulate fetching data from an API on mount
  useEffect(() => {
    async function fetchRoles() {
      try {
        // Replace with real endpoint
        // const response = await fetch("https://api.example.com/roles");
        // const data = await response.json();

        // We'll simulate success with defaultRoles
        const data = defaultRoles;

        if (data && data.length > 0) {
          // Add a "selected" property to each item so we can track checkboxes
          const rolesWithSelected = data.map((role) => ({
            ...role,
            selected: false,
          }));
          setRoles(rolesWithSelected);
        } else {
          // No data returned from API
          setRoles([]);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        // On error, set an empty array or fallback data
        setRoles([]);
      }
    }

    fetchRoles();
  }, []);

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) =>
    role.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle logout (dummy function for now)
  const handleLogout = () => {
    console.log("Logout clicked");
    // Implement your logout logic
  };

  // Toggle "select all" checkboxes
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    setRoles((prevRoles) =>
      prevRoles.map((role) => ({ ...role, selected: checked }))
    );
  };

  // Toggle individual row checkbox
  const handleCheckboxChange = (id, checked) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === id ? { ...role, selected: checked } : role
      )
    );
  };

  // Keep "selectAll" in sync if user manually toggles any row
  useEffect(() => {
    // If every role is selected, setSelectAll = true; otherwise false
    const allSelected =
      roles.length > 0 && roles.every((role) => role.selected);
    setSelectAll(allSelected);
  }, [roles]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar className="w-1/4 h-screen fixed md:relative" />

      {/* Main Content */}
      <main className="flex-1 p-6 ml-1/4 overflow-y-auto h-screen">
        {/* Header */}
        <header className="grid grid-cols-3 items-center mb-4">
          {/* Left Column: Greeting */}
          <div className="text-left">
            <h1 className="text-2xl font-semibold">Hello Orson 👋,</h1>
          </div>

          {/* Center Column: Management Title */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">User Access Settings</h1>
          </div>

          {/* Right Column: Search Bar and Logout Button */}
          <div className="flex items-center justify-end space-x-1">
            <div className="relative w-64">
              <FiSearch className="absolute top-2 left-2 text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-3 py-2 border rounded-md w-full"
              />
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              <FaSignOutAlt className="text-xl" />
            </button>
          </div>
        </header>

        {/* Roles & Permissions Table */}
        <section className="bg-white p-5 rounded-md shadow">
          <div className="p-6">
            {/* Top row: Heading and profile picture */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[24px] font-semibold">Roles & Permissions</h2>
              {/* Example profile image */}
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>

            {/* Horizontal line */}
            <hr className="mb-4 border-gray-300" />

            {/* Search bar and button row */}
            <div className="flex flex-wrap justify-between items-center">
              <div className="relative w-full md:w-64 mb-4 md:mb-0">
                <FiSearch className="absolute top-3 left-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search roles here"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 bg-gray-100 rounded-full focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={() => navigate("/create-agent-profile")}
              >
                Create Role & Profile
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-gray-100">
                  {/* Checkbox header */}
                  <th className="p-3 w-10">
                    <input
                      type="checkbox"
                      // If all rows are selected, this is true
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </th>
                  <th className="p-3 text-left">Roles</th>
                  <th className="p-3 text-left">Users</th>
                  <th className="p-3 text-left">Last Updated</th>
                  <th className="p-3 text-left">Created By</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-3 text-center">
                      No roles found.
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((role, index) => (
                    <tr
                      key={role.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      {/* Checkbox cell */}
                      <td className="p-3 w-10 align-middle">
                        <input
                          type="checkbox"
                          checked={!!role.selected}
                          onChange={(e) =>
                            handleCheckboxChange(role.id, e.target.checked)
                          }
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="p-3 text-left align-middle">
                        {role.role}
                      </td>
                      <td className="p-3 text-left align-middle">
                        {role.users}
                      </td>
                      <td className="p-3 text-left align-middle">
                        {role.lastUpdated}
                      </td>
                      <td className="p-3 align-middle">
                        <div className="flex items-center space-x-2">
                          <img
                            src={role.avatar}
                            alt={role.createdBy}
                            className="w-8 h-8 rounded-full border-2 border-gray-300"
                          />
                          <span>{role.createdBy}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center align-middle">
                        <button className="inline-block text-blue-500 hover:text-blue-700 mr-4">
                          <FiUsers size={18} />
                        </button>
                        <button className="inline-block text-gray-500 hover:text-gray-700 mr-4">
                          <FiEdit2 size={18} onClick={() => navigate("/edit-agent-profile", { state: role })} />
                        </button>
                        <button className="inline-block text-gray-500 hover:text-gray-700">
                          <FiMoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserAccessSettings;
