import { useState, useContext, useEffect } from "react";
import { FaUsers, FaPowerOff } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import AuthContext from "../context/AuthContext";
import Sidebar from "../components/Sidebar"; // Import Sidebar
import ConvertedLeadsChart from "../components/ConvertedLeadsChart"; // Import Sidebar
import api from "../api";
import {  FaUserCheck, FaDesktop } from "react-icons/fa";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import DataTable from "react-data-table-component";
import '../styles/Dashboard.css'
import electricityIcon from '../assets/electricity.png';
import gasIcon from '../assets/gas.png';



const statuses = ["New", "First Call Attempt", "Call Attempt", "Invalid Lead", "No Sale", "Organised", "Follow Up", "(EC) Script", "Sale"];



const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const { logout } = useContext(AuthContext);
  const [currentPageLead, setCurrentPageLead] = useState(1);
  const [totalPagesLead, setTotalPagesLead] = useState(1);
  const [currentPageSale, setCurrentPageSale] = useState(1);
  const [totalPagesSale, setTotalPagesSale] = useState(1);
  const navigate = useNavigate();
  const columns = [
    { name: "Lead Name", selector: (row) => row.customer_name, sortable: true, },
    { name: "Move-in Date", selector: (row) => formatDate(row.submitted), sortable: true,  },
    { name: "Phone Number", selector: (row) => row.phone,  },
    { name: "Email", selector: (row) => row.tenant.email,  },
    { name: "Move-in Address", selector: (row) => row.address.text,  },
    { name: "Product", selector: (row) => getProducts(row.services),  },
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
      
    },
  ];


  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const payload = { 
          submitted: "", 
          page: currentPageLead,
          status: "New"
        };
        const { data } = await api.get('/crm/flk/leads-db/', { params: payload });
        setLeads(data.leads);
        setTotalPagesLead(data.totalPages);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };
    const fetchSales = async () => {
      try {
        const payload = { 
          submitted: "", 
          page: currentPageSale,
          status: "Sale"
        };
        const { data } = await api.get('/crm/flk/leads-db/', { params: payload });
        setSales(data.leads);
        setTotalPagesSale(data.totalPages);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };
    fetchLeads();
    fetchSales();
  }, [currentPageLead, currentPageSale]);

  const formatDate = (dateString) => {
    let d = new Date(dateString)
    const formattedDate = new Date(dateString).toISOString().split("T")[0];
    return formattedDate
  }

  // const getProducts = (services) => {
  //   return Object.keys(services)
  //   .filter(key => services[key]) // Filter only keys with true values
  //   .join(", "); // Join them with a comma
  // }
  const getProducts = (services) => {
    return (
      <div className="flex space-x-2">
        {Object.keys(services)
          .filter(key => services[key])
          .map(key => {
            switch (key) {
              case 'electricity':
                return (
                  <img
                    key={key}
                    src={electricityIcon}
                    alt="Electricity"
                    className="w-6 h-6"
                  />
                );
              case 'gas':
                return (
                  <img
                    key={key}
                    src={gasIcon}
                    alt="Gas"
                    className="w-6 h-6"
                  />
                );
              default:
                return <span key={key}>{key}</span>;
            }
          })}
      </div>
    );
  };
  
  const handleStatusChange = (id, newStatus) => {
    setLeads(leads.map(lead => (lead.id === id ? { ...lead, status: newStatus } : lead)));
    setSelectedStatus({ ...selectedStatus, [id]: newStatus });
  };

  const handleLogout = () => {
    logout()
  };

  const handleRowClick = (row) => {
    navigate("/lead-capture-form", { state: { lead: row } });
  }

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
        

        {/* Leads Table with status = new */}
        <section className="bg-white p-5 rounded-xl shadow">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">All Leads</h2>
              {/* <p className="text-blue-600 text-sm ml-5">Active Members</p> */}
            </div>
    
            <button onClick={() => navigate("/lead-capture-form")} 
              className="bg-blue-600 text-white px-4 py-2 rounded-md">Create New Lead</button>
          </div>
          <div className="overflow-x-auto">
            <DataTable
                title=""
                columns={columns}
                data={leads}
                pagination
                paginationServer
                paginationTotalRows={totalPagesLead * 5} // Assuming 10 leads per page
                paginationPerPage={5}
                paginationComponentOptions={{ noRowsPerPage: true }}
                onChangePage={(page) => setCurrentPageLead(page)}
                onRowClicked={(row) => handleRowClick(row)}
                highlightOnHover
              />
          </div>
        </section>

        <br />

        {/* Leads Table with status = sale */}
        <section style={{display: "none"}} className="bg-white p-5 rounded-xl shadow">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">SALES</h2>
            </div>
            </div>
          <div className="overflow-x-auto">
            <DataTable
                title=""
                columns={columns}
                data={sales}
                pagination
                paginationServer
                paginationTotalRows={totalPagesSale * 5} // Assuming 5 leads per page
                paginationPerPage={5}
                paginationComponentOptions={{ noRowsPerPage: true }}
                onChangePage={(page) => setCurrentPageSale(page)}
                highlightOnHover
              />
          </div>
        </section>

        <br />

        {/* Graophs.. */}
        <section className="bg-white p-5 rounded-xl shadow">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Overview</h2>
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

export default Dashboard;