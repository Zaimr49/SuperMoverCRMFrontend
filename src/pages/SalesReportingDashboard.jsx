import React, { useState, useContext, useEffect } from "react";
import {
  FiSearch,
  FiArrowUp,
  FiArrowDown,
  FiChevronDown,
} from "react-icons/fi";
import { FaUsers, FaDesktop, FaUserCheck, FaSignOutAlt } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import AuthContext from "../context/AuthContext";

// Recharts imports
import { BarChart, Bar, Tooltip, ResponsiveContainer } from "recharts";
// import axios from "axios"; // If you use axios for data fetching

export default function ManagementDashboard() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { logout } = useContext(AuthContext);

  // State for top cards (if needed from API) and chart data
  const [newLeadsData, setNewLeadsData] = useState([]);
  const [inProgressLeadsData, setInProgressLeadsData] = useState([]);
  const [leadSourceData, setLeadSourceData] = useState([]);
  const [retailersData, setRetailersData] = useState([]);

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleLogout = () => {
    logout();
  };

  // Fetch data from API or use mock data
  useEffect(() => {
    // Example with mock data; replace with your actual API call
    // e.g.:
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get("/api/dashboardData");
    //     setNewLeadsData(response.data.newLeads);
    //     setInProgressLeadsData(response.data.inProgressLeads);
    //     setLeadSourceData(response.data.leadSource);
    //     setRetailersData(response.data.retailers);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    // fetchData();

    // Mock data for demonstration:
    setNewLeadsData([
      { name: "Last month", value: 60 },
      { name: "Current month", value: 80 },
    ]);
    setInProgressLeadsData([
      { name: "Last month", value: 70 },
      { name: "Current month", value: 50 },
    ]);
    setLeadSourceData([
      { name: "REA office", value: 50 },
      { name: "REA software", value: 70 },
    ]);
    setRetailersData([
      { name: "Electricity", value: 40 },
      { name: "Gas", value: 70 },
      { name: "Dual Fuel", value: 50 },
    ]);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        style={{ width: "25%" }}
        className="w-1/4 h-screen fixed md:relative"
      />

      {/* Main Content */}
      <main
        className="flex-1 p-6 ml-1/4 overflow-y-auto h-screen"
        style={{ width: "75%" }}
      >
        <header className="grid grid-cols-3 items-center mb-4">
          {/* Left Column: Greeting */}
          <div className="text-left">
            <h1 className="text-2xl font-semibold">Hello Orson 👋,</h1>
          </div>

          {/* Center Column: Management Title */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">
              Management Sales & Reporting Dashboard
            </h1>
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
        <div className="bg-white p-6 pb-16 rounded-lg shadow-md">
          {/* =================== TOP CARDS SECTION =================== */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6">
            {/* New Leads Card */}
            <div className="bg-white p-6 rounded-lg border relative">
              <div className="flex items-start justify-between">
                <div className="p-4 rounded-full bg-green-100 flex items-center justify-center">
                  <FaUsers className="text-blue-700 text-3xl" />
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">New Leads</p>
                  <p className="text-3xl font-bold">5,423</p>
                  <p className="text-green-500 flex items-center text-sm">
                    <FiArrowUp className="mr-1" />
                    16% this month
                  </p>
                </div>
                <button
                  onClick={() => toggleDropdown("leads")}
                  className="absolute top-2 right-2 text-gray-400"
                >
                  <FiChevronDown />
                </button>
              </div>
              {activeDropdown === "leads" && (
                <div className="absolute top-6 right-2 bg-white shadow-lg rounded-md p-2 z-10 text-sm w-48">
                  <p>Total Lead Volume by Time Period</p>
                </div>
              )}
            </div>

            {/* In-Progress Leads Card */}
            <div className="bg-white p-6 rounded-lg border relative">
              <div className="flex items-start justify-between">
                <div className="p-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaUserCheck className="text-blue-700 text-3xl" />
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">In-Progress Leads</p>
                  <p className="text-3xl font-bold">1,893</p>
                  <p className="text-red-500 flex items-center text-sm">
                    <FiArrowDown className="mr-1" />
                    1% this month
                  </p>
                </div>
                <button
                  onClick={() => toggleDropdown("sales")}
                  className="absolute top-2 right-2 text-gray-400"
                >
                  <FiChevronDown />
                </button>
              </div>
              {activeDropdown === "sales" && (
                <div className="absolute top-6 right-2 bg-white shadow-lg rounded-md p-2 z-10 text-sm w-48">
                  <p>Track Sales Conversion Rates</p>
                </div>
              )}
            </div>

            {/* Sales by Lead Source Card */}
            <div className="bg-white p-6 rounded-lg border relative">
              <div className="flex items-start justify-between">
                <div className="p-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaDesktop className="text-blue-600 text-3xl" />
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Sales by Lead Source</p>
                  <p className="text-3xl font-bold">1,893</p>
                </div>
                <button
                  onClick={() => toggleDropdown("lead")}
                  className="absolute top-2 right-2 text-gray-400"
                >
                  <FiChevronDown />
                </button>
              </div>
              {activeDropdown === "lead" && (
                <div className="absolute top-6 right-2 bg-white shadow-lg rounded-md p-2 z-10 text-sm w-48">
                  <p>REA Office</p>
                  <p>REA Software</p>
                </div>
              )}
            </div>

            {/* Sales Product by Retailers Card */}
            <div className="bg-white p-6 rounded-lg border relative">
              <div className="flex items-start justify-between">
                <div className="p-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaDesktop className="text-blue-600 text-3xl" />
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">
                    Sales Product by Retailers
                  </p>
                  <p className="text-3xl font-bold">1,893</p>
                </div>
                <button
                  onClick={() => toggleDropdown("retailers")}
                  className="absolute top-2 right-2 text-gray-400"
                >
                  <FiChevronDown />
                </button>
              </div>
              {activeDropdown === "retailers" && (
                <div className="absolute top-6 right-2 bg-white shadow-lg rounded-md p-2 z-10 text-sm w-48">
                  <p>Origin Energy</p>
                  <p>AGL</p>
                  <p>Energy Australia</p>
                  <p>PowerShop</p>
                  <p>Red Energy</p>
                  <p>Tango</p>
                </div>
              )}
            </div>
          </div>
          {/* =================== END TOP CARDS SECTION =================== */}

          {/* ========== BAR CHARTS SECTION (SEPARATE) ========== */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* 1) New Leads Chart */}
            <div className="bg-white p-6 rounded-lg">
              <div style={{ width: "100%", height: 150 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={newLeadsData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    {/* No axes, just a tooltip */}
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Custom labels beneath the bars */}
              <div className="flex justify-around mt-2 text-xs text-gray-600">
                <span>Last month</span>
                <span>Current month</span>
              </div>
            </div>

            {/* 2) In-Progress Leads Chart */}
            <div className="bg-white p-6 rounded-lg">
              <div style={{ width: "100%", height: 150 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={inProgressLeadsData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around mt-2 text-xs text-gray-600">
                <span>Last month</span>
                <span>Current month</span>
              </div>
            </div>

            {/* 3) Sales by Lead Source Chart */}
            <div className="bg-white p-6 rounded-lg">
              <div style={{ width: "100%", height: 150 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={leadSourceData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around mt-2 text-xs text-gray-600">
                <span>REA office</span>
                <span>REA software</span>
              </div>
            </div>

            {/* 4) Sales Product by Retailers Chart */}
            <div className="bg-white p-6 rounded-lg">
              <div style={{ width: "100%", height: 150 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={retailersData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around mt-2 text-xs text-gray-600">
                <span>Electricity</span>
                <span>Gas</span>
                <span>Dual Fuel</span>
              </div>
            </div>
          </div>
          {/* ========== END BAR CHARTS SECTION ========== */}

          {/* ========== NEW SECTION: COMMISSION TRACKING & RECONCILIATION ========== */}
          <div className="flex flex-col md:flex-row md:items-start md:space-x-6 mt-6">
            {/* Commission Tracking Card */}
            <div className="bg-white p-6 rounded-lg border relative w-72 mb-6 md:mb-0">
              {/* Card Header */}
              <div className="flex items-center">
                {/* Icon */}
                <div className="p-4 rounded-full bg-green-100 flex items-center justify-center">
                  <FaUsers className="text-blue-700 text-3xl" />
                </div>
                {/* Text (Left Aligned) */}
                <div className="ml-3 text-left">
                  <p className="text-gray-700 font-semibold">
                    Commission Tracking
                  </p>
                  <p className="text-gray-500 text-sm">
                    Update Commission Status
                  </p>
                </div>
                {/* Dropdown Toggle Button (Positioned Absolutely) */}
                <button
                  onClick={() => toggleDropdown("commission")}
                  className="absolute top-2 right-2 text-gray-400"
                >
                  <FiChevronDown />
                </button>
              </div>
              {/* Dropdown Content */}
              {activeDropdown === "commission" && (
                <div className="absolute top-6 right-2 bg-white shadow-lg rounded-md p-3 z-10 text-sm w-60">
                  <ul className="list-disc list-inside ml-4 text-gray-700">
                    <li>Pending (Not Yet Paid)</li>
                    <li>Confirmed (Payables / Sales)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Financial Reconciliation Reports Card */}
            <div className="bg-white p-6 rounded-lg border relative w-72">
              {/* Card Header */}
              <div className="flex items-center">
                {/* Icon */}
                <div className="p-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaDesktop className="text-blue-600 text-3xl" />
                </div>
                {/* Text (Left Aligned) */}
                <div className="ml-3 text-left">
                  <p className="text-gray-700 font-semibold">
                    Financial Reconciliation Reports
                  </p>
                  <p className="text-gray-500 text-sm">Generate Reports</p>
                </div>
                {/* Dropdown Toggle Button (Positioned Absolutely) */}
                <button
                  onClick={() => toggleDropdown("financial")}
                  className="absolute top-2 right-2 text-gray-400"
                >
                  <FiChevronDown />
                </button>
              </div>
              {/* Dropdown Content */}
              {activeDropdown === "financial" && (
                <div className="absolute top-6 right-2 bg-white shadow-lg rounded-md p-3 z-10 text-sm w-60">
                  <ul className="list-disc list-inside ml-4 text-gray-700">
                    <li>Leads Received</li>
                    <li>Sales Processed</li>
                    <li>Product Names</li>
                    <li>Customer Details</li>
                    <li>Retailer Details</li>
                    <li>Transaction Dates</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* ========== END NEW SECTION ========== */}
        </div>
      </main>
    </div>
  );
}
