import { useState, useContext, useEffect } from "react";
import { FaUsers, FaPowerOff } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import { FiSearch } from "react-icons/fi";
import {
  FiSearch,
  FiArrowUp,
  FiArrowDown,
  FiChevronDown,
} from "react-icons/fi";
import AuthContext from "../context/AuthContext";
import Sidebar from "../components/Sidebar"; // Import Sidebar
import ConvertedLeadsChart from "../components/ConvertedLeadsChart"; // Import Sidebar
import api from "../api";
import {  FaUserCheck, FaDesktop } from "react-icons/fa";
// import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import DataTable from "react-data-table-component";
import '../styles/Dashboard.css'
import { BarChart, Bar, Tooltip, ResponsiveContainer } from "recharts";


const statuses = ["New", "First Call Attempt", "Call Attempt", "Invalid Lead", "No Sale", "Organised", "Follow Up", "(EC) Script", "Sale"];


const SalesAndReporting = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sales, setSales] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const { logout } = useContext(AuthContext);
  const [currentPageSale, setCurrentPageSale] = useState(1);
  const [totalPagesSale, setTotalPagesSale] = useState(1);
  const [newLeadsData, setNewLeadsData] = useState([]);
  const [inProgressLeadsData, setInProgressLeadsData] = useState([]);
  const [leadSourceData, setLeadSourceData] = useState([]);
  const [retailersData, setRetailersData] = useState([]);

  const columns = [
    { name: "Lead Name", selector: (row) => row.customer_name, sortable: true, },
    { name: "Move-in Date", selector: (row) => formatDate(row.submitted), sortable: true,  },
    { name: "Phone Number", selector: (row) => row.phone,  },
    { name: "Email", selector: (row) => row.tenant.email,  },
    { name: "Move-in Address", selector: (row) => row.address.text,  },
    { name: "Product", selector: (row) => getProducts(row.services),  },
    {
      name: "Status",
      cell: (row) => {
        return (
          <select
            className="border p-2 rounded-md bg-gray-100"
            value={selectedStatus[row.id] || row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            disabled
          >
            {statuses.map((status) => (
              <option key={status.toLocaleLowerCase()} value={status.toLocaleLowerCase()}>
                {status}
              </option>
            ))}
          </select>
        )
      }
      
    },
  ];


  // Fetch leads from API
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const payload = { 
          submitted: "", 
          page: currentPageSale,
          status: "Sale",
          items_per_page: 15
        };
        const { data } = await api.get('/crm/flk/leads-db/', { params: payload });
        setSales(data.leads);
        setTotalPagesSale(data.totalPages);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };
    async function fetchDashboardData() {
      // New Leads
      try {
        const newLeadsRes = await fetch(
          "http://127.0.0.1:8000/api/sales-dashboard/new-leads/"
        );
        if (newLeadsRes.ok) {
          const data = await newLeadsRes.json();
          setNewLeadsData(data);
        } else {
          throw new Error("Error fetching new leads");
        }
      } catch (error) {
        console.error("Error fetching new leads:", error);
        setNewLeadsData([
          { name: "Last month", value: 60 },
          { name: "Current month", value: 80 },
        ]);
      }

      // In-Progress Leads
      try {
        const inProgressRes = await fetch(
          "http://127.0.0.1:8000/api/sales-dashboard/in-progress-leads/"
        );
        if (inProgressRes.ok) {
          const data = await inProgressRes.json();
          setInProgressLeadsData(data);
        } else {
          throw new Error("Error fetching in-progress leads");
        }
      } catch (error) {
        console.error("Error fetching in-progress leads:", error);
        setInProgressLeadsData([
          { name: "Last month", value: 70 },
          { name: "Current month", value: 50 },
        ]);
      }

      // Lead Source Data
      try {
        const leadSourceRes = await fetch(
          "http://127.0.0.1:8000/api/sales-dashboard/lead-source/"
        );
        if (leadSourceRes.ok) {
          const data = await leadSourceRes.json();
          setLeadSourceData(data);
        } else {
          throw new Error("Error fetching lead source data");
        }
      } catch (error) {
        console.error("Error fetching lead source:", error);
        setLeadSourceData([
          { name: "REA office", value: 50 },
          { name: "REA software", value: 70 },
        ]);
      }
      // Retailers Data
      try {
        const retailersRes = await fetch(
          "http://127.0.0.1:8000/api/sales-dashboard/retailers/"
        );
        if (retailersRes.ok) {
          const data = await retailersRes.json();
          setRetailersData(data);
        } else {
          throw new Error("Error fetching retailers data");
        }
      } catch (error) {
        console.error("Error fetching retailers:", error);
        setRetailersData([
          { name: "Electricity", value: 40 },
          { name: "Gas", value: 70 },
          { name: "Dual Fuel", value: 50 },
        ]);
      }
    }
    fetchDashboardData();
    fetchSales();
  }, [currentPageSale]);

  const formatDate = (dateString) => {
    let d = new Date(dateString)
    const formattedDate = new Date(dateString).toISOString().split("T")[0];
    return formattedDate
  }

  const getProducts = (services) => {
    return Object.keys(services)
    .filter(key => services[key]) // Filter only keys with true values
    .join(", "); // Join them with a comma
  }

  const handleLogout = () => {
    logout()
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar style={{width: "25%"}} className="w-1/4 h-screen fixed md:relative" /> 
 
      {/* Main Content */}
      <main className="flex-1 p-6 ml-1/4 overflow-y-auto h-screen" style={{width: "75%"}}>
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h1 className="text-2xl font-semibold mb-2 md:mb-0">Hello Orson 👋,</h1>
          <div style={{display: 'flex'}}>
            <div style={{width: "10%"}}></div>
            <div className="relative  ml-auto" style={{width: "25rem"}}>
              <FiSearch className="absolute top-2 left-2 text-gray-500"  />
              <input type="text" placeholder="Search" className="pl-8 pr-3 py-2 border rounded-md w-full" />
            </div>
            <div style={{width: "5%"}}></div>
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800 ml-1 ml-auto">
              <FaPowerOff className="text-xl" />
            </button>
          </div>
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
        

        <br />

        {/* Leads Table with status = sale */}
        <section className="bg-white p-5 rounded-xl shadow">
          {/* ========== BAR CHARTS SECTION ========== */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* New Leads Chart */}
            <div className="bg-white p-6 rounded-lg">
              <div style={{ width: "100%", height: 150 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={newLeadsData}
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

            {/* In-Progress Leads Chart */}
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

            {/* Sales by Lead Source Chart */}
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

            {/* Sales Product by Retailers Chart */}
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

          {/* <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">SALES</h2>
            </div>
          </div> */}
          <br />
          <br />
          <div>
            <h2 className="text-xl font-semibold mb-4 text-left">All Sales</h2>
          <div className="overflow-x-auto" >
            <DataTable
                title=""
                columns={columns}
                data={sales}
                pagination
                paginationServer
                paginationTotalRows={totalPagesSale * 15} // Assuming 5 leads per page
                paginationPerPage={15}
                paginationComponentOptions={{ noRowsPerPage: true }}
                onChangePage={(page) => setCurrentPageSale(page)}
                highlightOnHover
              />
          </div>
          </div>
        </section>


        {/* ========== NEW SECTION: COMMISSION TRACKING & RECONCILIATION ========== */}
        <div className="flex flex-col md:flex-row md:items-start md:space-x-6 mt-6">
            {/* Commission Tracking Card */}
            <div className="bg-white p-6 rounded-lg border relative w-72 mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="p-4 rounded-full bg-green-100 flex items-center justify-center">
                  <FaUsers className="text-blue-700 text-3xl" />
                </div>
                <div className="ml-3 text-left">
                  <p className="text-gray-700 font-semibold">
                    Commission Tracking
                  </p>
                  <p className="text-gray-500 text-sm">
                    Update Commission Status
                  </p>
                </div>
                <button
                  onClick={() => toggleDropdown("commission")}
                  className="absolute top-2 right-2 text-gray-400"
                >
                  <FiChevronDown className="text-gray-700 font-bold" />
                </button>
              </div>
              {activeDropdown === "commission" && (
                <div className="absolute top-6 right-2 bg-white border-2 border-gray-300 shadow-xl rounded-md p-3 z-10 text-sm w-60 text-left">
                  <ul className="list-disc list-inside ml-4 text-gray-700">
                    <li>Pending (Not Yet Paid)</li>
                    <li>Confirmed (Payables / Sales)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Financial Reconciliation Reports Card */}
            <div className="bg-white p-6 rounded-lg border relative w-72">
              <div className="flex items-center">
                <div className="p-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaDesktop className="text-blue-600 text-3xl" />
                </div>
                <div className="ml-3 text-left">
                  <p className="text-gray-700 font-semibold">
                    Financial Reconciliation Reports
                  </p>
                  <p className="text-gray-500 text-sm">Generate Reports</p>
                </div>
                <button
                  onClick={() => toggleDropdown("financial")}
                  className="absolute top-2 right-2 text-gray-400"
                >
                  <FiChevronDown className="text-gray-700 font-bold" />
                </button>
              </div>
              {activeDropdown === "financial" && (
                <div className="absolute top-6 right-2 bg-white border-2 border-gray-300 shadow-xl rounded-md p-3 z-10 text-sm w-60 text-left">
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

        {/* Graophs.. */}
        <section style={{display: "none"}} className="bg-white p-5 rounded-xl shadow">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">STATS</h2>
            </div>
            </div>
          <div className="overflow-x-auto">
            <ConvertedLeadsChart />
          </div>
        </section>

      </main>
    </div>
  );
};

export default SalesAndReporting;