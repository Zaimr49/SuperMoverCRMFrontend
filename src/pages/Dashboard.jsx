import { useState, useContext, useEffect } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import AuthContext from "../context/AuthContext";
import Sidebar from "../components/Sidebar"; // Import Sidebar
import api from "../api";
import { FaUserCheck, FaDesktop } from "react-icons/fa";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import DataTable from "react-data-table-component";
import "../styles/Dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  const monthlyEarningsData = [
    { month: "Jan", earnings: 4000 },
    { month: "Feb", earnings: 4500 },
    { month: "Mar", earnings: 6000 },
    { month: "Apr", earnings: 5000 },
    { month: "May", earnings: 3500 },
    { month: "Jun", earnings: 5500 },
    { month: "Jul", earnings: 6000 },
    { month: "Aug", earnings: 9000, highlight: true }, // Highlighted month
    { month: "Sep", earnings: 7000 },
    { month: "Oct", earnings: 6500 },
    { month: "Nov", earnings: 5500 },
    { month: "Dec", earnings: 7000 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white text-sm px-3 py-2 rounded shadow-md">
          <p className="flex items-center">
            <span className="mr-2">📈</span> {`${payload[0].value} USD`}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderBarColor = (data) => {
    return data.highlight ? "#003399" : "rgba(0, 0, 0, 0.1)";
  };

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const payload = { submitted: "", page: currentPage };
        const { data } = await api.get("/crm/flk/leads-db/", {
          params: payload,
        });
        // console.log(data.leads)
        setLeads(data.leads);
        setTotalPages(data.totalPages);
        // setCurrentPage(currentPage + 1)
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };
    fetchLeads();
  }, [currentPage]);

  const formatDate = (dateString) => {
    console.log(dateString);
    let d = new Date(dateString);
    console.log(d);
    const formattedDate = new Date(dateString).toISOString().split("T")[0];
    return formattedDate;
  };

  const getProducts = (services) => {
    return Object.keys(services)
      .filter((key) => services[key]) // Filter only keys with true values
      .join(", "); // Join them with a comma
  };

  const handleStatusChange = (id, newStatus) => {
    setLeads(
      leads.map((lead) =>
        lead.id === id ? { ...lead, status: newStatus } : lead
      )
    );
    setSelectedStatus({ ...selectedStatus, [id]: newStatus });
  };

  const handleLogout = () => {
    logout();
  };

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
            {/* <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">Lead Name</th>
                  <th className="p-3 border">Move-in Date</th>
                  <th className="p-3 border">Phone Number</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Move-in Address</th>
                  <th className="p-3 border">Product</th>
                  <th className="p-3 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="text-center">
                    {console.log(lead)}
                    <td className="p-3 border">{lead.customer_name}</td>
                    <td className="p-3 border">{formatDate(lead.submitted)}</td>
                    <td className="p-3 border">{lead.phone}</td>
                    <td className="p-3 border">{lead.tenant.email}</td>
                    <td className="p-3 border">{lead.address.text}</td>
                    <td className="p-3 border">{getProducts(lead.services)}</td>
                    <td className="p-3 border relative">
                      <select
                        className="border p-2 rounded-md bg-gray-100"
                        value={selectedStatus[lead.id] || lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}
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
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-500 text-sm">Monthly Earning</p>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={monthlyEarningsData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="earnings"
                fill={(data) => renderBarColor(data)}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
