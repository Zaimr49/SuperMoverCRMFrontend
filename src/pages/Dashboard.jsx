import { useState, useContext, useEffect } from "react";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaSignOutAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import AuthContext from "../context/AuthContext";
import config from "../config";
import api from "../api";


const leadsData = [
  { id: 1, name: "Jane Cooper", date: "25-02-25", phone: "(+61) 0415 134 134", email: "jane@microsoft.com", address: "76 Nelson Drive", product: "Dual Fuel", status: "New" },
  { id: 2, name: "Floyd Miles", date: "26-03-25", phone: "(+61) 0467 111 129", email: "floyd@yahoo.com", address: "76 Nelson Drive", product: "Electricity", status: "Call Attempt" },
  { id: 3, name: "Ronald Richards", date: "27-04-25", phone: "(+61) 0497 976 976", email: "ronald@adobe.com", address: "76 Nelson Drive", product: "Gas", status: "Inactive" },
];

const statuses = ["New", "First Call Attempt", "Call Attempt", "Invalid Lead", "No Sale", "Organised", "Follow Up", "(EC) Script", "Sale"];

const Dashboard = () => {
  const [leads, setLeads] = useState(leadsData);
  const [selectedStatus, setSelectedStatus] = useState({});
  const { logout } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const payload = { submitted: "", page: currentPage };
        const { data } = await api.get('/crm/flk/leads-db/', { params: payload });
        // setLeads(data.results);
        setTotalPages(data.totalPages);
        // setCurrentPage(currentPage + 1)
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };
    fetchLeads();
  }, [currentPage]);

  const handleStatusChange = (id, newStatus) => {
    setLeads(leads.map(lead => (lead.id === id ? { ...lead, status: newStatus } : lead)));
    setSelectedStatus({ ...selectedStatus, [id]: newStatus });
  };

  const handleLogout = () => {
    logout()
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-md p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600 flex items-center">⚡ SUPER MOVER</h2>
          
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#" className="flex items-center p-3 rounded-md bg-blue-600 text-white font-semibold">
                📊 Lead Dashboard
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-gray-200 rounded-md">
                📌 Lead Status Management
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-gray-200 rounded-md">
                📈 Sales & Reporting Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-gray-200 rounded-md">
                ⚙️ User Access Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h1 className="text-2xl font-semibold mb-2 md:mb-0">Hello Orson 👋,</h1>
          <div className="relative w-full md:w-64 ml-auto">
            <FiSearch className="absolute top-2 left-2 text-gray-500" />
            <input type="text" placeholder="Search" className="pl-8 pr-3 py-2 border rounded-md w-full" />
          </div>
          <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800 ml-1">
            <FaSignOutAlt className="text-xl" />
          </button>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="p-5 bg-white rounded-md shadow flex items-center">
            <FaUsers className="text-green-500 text-3xl mr-4" />
            <div>
              <p className="text-lg font-semibold">New Leads</p>
              <p className="text-2xl font-bold">5,423</p>
              <p className="text-green-500">↑ 16% this month</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-md shadow flex items-center">
            <FaCheckCircle className="text-blue-500 text-3xl mr-4" />
            <div>
              <p className="text-lg font-semibold">In-Progress Leads</p>
              <p className="text-2xl font-bold">1,893</p>
              <p className="text-red-500">↓ 1% this month</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-md shadow flex items-center">
            <FaTimesCircle className="text-gray-500 text-3xl mr-4" />
            <div>
              <p className="text-lg font-semibold">Closed Leads</p>
              <p className="text-2xl font-bold">189</p>
            </div>
          </div>
        </section>

        {/* Leads Table */}
        <section className="bg-white p-5 rounded-md shadow">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <h2 className="text-lg font-semibold mb-2 md:mb-0">All Leads</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Create New Lead</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
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
                    <td className="p-3 border">{lead.name}</td>
                    <td className="p-3 border">{lead.date}</td>
                    <td className="p-3 border">{lead.phone}</td>
                    <td className="p-3 border">{lead.email}</td>
                    <td className="p-3 border">{lead.address}</td>
                    <td className="p-3 border">{lead.product}</td>
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
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;