import { useState, useContext, useEffect } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiArrowUp, FiArrowDown } from "react-icons/fi";
import AuthContext from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { FaUserCheck, FaDesktop } from "react-icons/fa";
import DataTable from "react-data-table-component";
import "../styles/Dashboard.css";

// Import only what we need from Recharts (no default Tooltip)
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

// List of possible statuses
const statuses = [
  "New",
  "First Call Attempt",
  "Call Attempt",
  "Invalid Lead",
  "No Sale",
  "Organised",
  "Follow Up",
  "(EC) Script",
  "Sale",
];

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const { logout } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // DataTable columns
  const columns = [
    {
      name: "Lead Name",
      selector: (row) => row.customer_name,
      sortable: true,
      width: "10%",
    },
    {
      name: "Move-in Date",
      selector: (row) => formatDate(row.submitted),
      sortable: true,
      width: "10%",
    },
    { name: "Phone Number", selector: (row) => row.phone, width: "10%" },
    { name: "Email", selector: (row) => row.tenant.email, width: "10%" },
    {
      name: "Move-in Address",
      selector: (row) => row.address.text,
      width: "15%",
    },
    {
      name: "Product",
      selector: (row) => getProducts(row.services),
      width: "10%",
    },
    {
      name: "Status",
      cell: (row) => (
        <select
          className="border p-2 rounded-md bg-gray-100"
          value={selectedStatus[row.id] || row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      ),
      width: "10%",
    },
  ];

  // Monthly data for the bar chart
  // We'll compute the "difference" and "isPositive" for each item
  const [monthlyEarningsData, setMonthlyEarningsData] = useState([
    { month: "Jan", earnings: 4000 },
    { month: "Feb", earnings: 4500 },
    { month: "Mar", earnings: 6000 },
    { month: "Apr", earnings: 5000 },
    { month: "May", earnings: 3500 },
    { month: "Jun", earnings: 5500 },
    { month: "Jul", earnings: 6000 },
    { month: "Aug", earnings: 9000 }, // highlight example
    { month: "Sep", earnings: 7000 },
    { month: "Oct", earnings: 6500 },
    { month: "Nov", earnings: 5500 },
    { month: "Dec", earnings: 7000 },
  ]);

  // Track which bar is hovered (for color highlight)
  const [activeIndex, setActiveIndex] = useState(null);

  // State for custom tooltip
  const [tooltipData, setTooltipData] = useState({
    visible: false,
    left: 0,
    top: 0,
    difference: 0,
    isPositive: true,
  });

  // Mouse event handlers for the bars
  const handleBarMouseEnter = (props, index) => {
    const { x, y, width, height } = props;
    setActiveIndex(index);

    // Position the tooltip at the top center of the bar
    const left = x + width / 2; // center horizontally
    const top = y - 30; // 30px above the bar

    // Retrieve difference data from monthlyEarningsData
    const { difference, isPositive } = monthlyEarningsData[index];

    setTooltipData({
      visible: true,
      left,
      top,
      difference,
      isPositive,
    });
  };

  const handleBarMouseLeave = () => {
    setActiveIndex(null);
    setTooltipData((prev) => ({ ...prev, visible: false }));
  };

  // Pre-compute difference from the previous month
  useEffect(() => {
    const updated = [...monthlyEarningsData];
    for (let i = 0; i < updated.length; i++) {
      if (i === 0) {
        updated[i].difference = 0;
        updated[i].isPositive = true;
      } else {
        const prev = updated[i - 1].earnings;
        const curr = updated[i].earnings;
        const diff = ((curr - prev) / prev) * 100;
        updated[i].difference = parseFloat(diff.toFixed(1));
        updated[i].isPositive = diff >= 0;
      }
    }
    setMonthlyEarningsData(updated);
  }, []);

  // Custom shape for each bar, so we can attach mouse events & get bar coords
  const CustomBarShape = (props) => {
    const { x, y, width, height, index } = props;

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        ry={4}
        fill={index === activeIndex ? "#003399" : "rgba(0, 0, 0, 0.1)"}
        onMouseEnter={() => handleBarMouseEnter({ x, y, width, height }, index)}
        onMouseLeave={handleBarMouseLeave}
      />
    );
  };

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const payload = { submitted: "", page: currentPage };
        const { data } = await api.get("/crm/flk/leads-db/", {
          params: payload,
        });
        setLeads(data.leads);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };
    fetchLeads();
  }, [currentPage]);

  // Helper for date formatting
  const formatDate = (dateString) => {
    const formattedDate = new Date(dateString).toISOString().split("T")[0];
    return formattedDate;
  };

  // Helper for products
  const getProducts = (services) => {
    return Object.keys(services)
      .filter((key) => services[key]) // only true keys
      .join(", ");
  };

  // Handle status change in the table
  const handleStatusChange = (id, newStatus) => {
    setLeads(
      leads.map((lead) =>
        lead.id === id ? { ...lead, status: newStatus } : lead
      )
    );
    setSelectedStatus({ ...selectedStatus, [id]: newStatus });
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  // State for the new dropdown (Quarterly / Yearly)
  const [timeFrame, setTimeFrame] = useState("Quarterly");

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
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h1 className="text-2xl font-semibold mb-2 md:mb-0">
            Hello Orson 👋,
          </h1>
          <div className="relative w-full md:w-64 ml-auto">
            <FiSearch className="absolute top-2 left-2 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-3 py-2 border rounded-md w-full"
            />
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800 ml-1"
          >
            <FaSignOutAlt className="text-xl" />
          </button>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          {/* New Leads Card */}
          <div className="flex bg-white p-6 rounded-lg shadow-md border items-center">
            <div className="p-4 rounded-full bg-green-100 flex items-center justify-center ml-4">
              <FaUsers className="text-blue-700 text-3xl" />
            </div>
            <div className="ml-16">
              <p className="text-gray-500 text-sm">New Leads</p>
              <p className="text-3xl font-bold">5,423</p>
              <p className="text-green-500 flex items-center mt-1 text-sm">
                <FiArrowUp className="mr-1" />
                16% this month
              </p>
            </div>
          </div>

          {/* In-Progress Leads Card */}
          <div className="flex bg-white p-6 rounded-lg shadow-md border items-center">
            <div className="p-4 rounded-full bg-green-100 flex items-center justify-center ml-4">
              <FaUserCheck className="text-blue-700 text-3xl" />
            </div>
            <div className="ml-16">
              <p className="text-gray-500 text-sm">In-Progress Leads</p>
              <p className="text-3xl font-bold">1,893</p>
              <p className="text-red-500 flex items-center mt-1 text-sm">
                <FiArrowDown className="mr-1" />
                1% this month
              </p>
            </div>
          </div>

          {/* Closed Leads Card */}
          <div className="flex bg-white p-6 rounded-lg shadow-md border items-center">
            <div className="p-4 rounded-full bg-green-100 flex items-center justify-center ml-4">
              <FaDesktop className="text-blue-700 text-3xl" />
            </div>
            <div className="ml-16">
              <p className="text-gray-500 text-sm">Closed Leads</p>
              <p className="text-3xl font-bold">189</p>
              {/* User Avatars */}
              <div className="flex mt-1">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="User 1"
                  className="w-8 h-8 rounded-full border-2 border-white -ml-2"
                />
                <img
                  src="https://randomuser.me/api/portraits/women/45.jpg"
                  alt="User 2"
                  className="w-8 h-8 rounded-full border-2 border-white -ml-2"
                />
                <img
                  src="https://randomuser.me/api/portraits/men/50.jpg"
                  alt="User 3"
                  className="w-8 h-8 rounded-full border-2 border-white -ml-2"
                />
                <img
                  src="https://randomuser.me/api/portraits/women/38.jpg"
                  alt="User 4"
                  className="w-8 h-8 rounded-full border-2 border-white -ml-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <section className="bg-white p-5 rounded-md shadow my-6">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">All Leads</h2>
              <p className="text-blue-600 text-sm ml-5">Active Members</p>
            </div>

            <button
              onClick={() => navigate("/lead-capture-form")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Create New Lead
            </button>
          </div>

          <div className="overflow-x-auto">
            <DataTable
              title=""
              columns={columns}
              data={leads}
              pagination
              paginationServer
              paginationTotalRows={totalPages * 10} // Assuming 10 leads per page
              paginationPerPage={10}
              paginationComponentOptions={{ noRowsPerPage: true }}
              onChangePage={(page) => setCurrentPage(page)}
              highlightOnHover
            />
          </div>
        </section>

        {/* Overview Bar Chart with custom bar-only tooltip & time-frame dropdown */}
        <div className="bg-white p-5 rounded-lg shadow-md border relative">
          {/* Top row: "Overview" & "Monthly Earning" on the left; dropdown on the right */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl pl-5 font-semibold text-left">Overview</h2>
              <p className="text-gray-500 pl-5 text-sm text-left">
                Monthly Earning
              </p>
            </div>
            {/* Dropdown for Quarterly / Yearly */}
            <div className="mr-5">
              <select
                className="border border-gray-300 rounded-md p-2 bg-gray-100 w-48 text-base text-gray-600 focus:border-gray-400 focus:ring-0"
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
              >
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Chart in a relative container so we can absolutely position the tooltip */}
          <div className="relative">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={monthlyEarningsData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                {/* X-axis (months), Y-axis hidden */}
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF" }}
                />
                <YAxis hide />

                {/* Use our custom shape to control tooltip position */}
                <Bar
                  dataKey="earnings"
                  barSize={40}
                  shape={<CustomBarShape />}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Absolutely positioned tooltip */}
            {tooltipData.visible && (
              <div
                className="bg-black text-white text-sm px-3 py-1 rounded shadow-md flex items-center pointer-events-none"
                style={{
                  position: "absolute",
                  left: tooltipData.left - 40, // offset for centering
                  top: tooltipData.top,
                  zIndex: 9999,
                }}
              >
                {tooltipData.isPositive ? (
                  <FiArrowUp className="text-green-500 mr-1" />
                ) : (
                  <FiArrowDown className="text-red-500 mr-1" />
                )}
                <span className="text-white">
                  {tooltipData.isPositive ? "+" : ""}
                  {tooltipData.difference}%
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// ================== Helper Functions ====================

// Format the date to YYYY-MM-DD
function formatDate(dateString) {
  const formattedDate = new Date(dateString).toISOString().split("T")[0];
  return formattedDate;
}

// Get a comma-separated string of products from the "services" object
function getProducts(services) {
  return Object.keys(services)
    .filter((key) => services[key])
    .join(", ");
}

export default Dashboard;
