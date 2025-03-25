"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/LeadCaptureForm.css";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

import api from "../api";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmAlert,
} from "../utils/alerts";

const LeadCaptureForm = () => {
  // Tenant states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); // used as secondName in payload
  const [email, setEmail] = useState("");
  const [phoneMobile, setPhoneMobile] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneMobileError, setPhoneMobileError] = useState("");

  // Address states
  const [billingAddress, setBillingAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [streetAddress, setStreetAddress] = useState("Auto populate");
  const [suburb, setSuburb] = useState("Auto populate");
  const [postcode, setPostcode] = useState("Auto populate");
  const [state, setState] = useState("Auto populate");
  const [streetNumber, setStreetNumber] = useState("");

  // Product states
  const [selectedProducts, setSelectedProducts] = useState({
    electricity: false,
    gas: false,
    water: false,
    broadband: false,
  });
  const [nmi, setNmi] = useState("");
  const [mirn, setMirn] = useState("");
  const [nmiError, setNmiError] = useState("");
  const [mirnError, setMirnError] = useState("");

  // Date states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // REA / Agent states
  const [agentName, setAgentName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [reaOfficeDetails, setReaOfficeDetails] = useState("");
  const [reaSoftwareUsed, setReaSoftwareUsed] = useState("");

  // Lead Management state
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const leadDataToEdit = location.state?.lead;

  useEffect(() => {
    if (leadDataToEdit) {
      setAgentName(leadDataToEdit.referringAgent?.name || "");
      setAgencyName(leadDataToEdit.referringAgency?.name || "");
      setFirstName(leadDataToEdit.tenant?.firstName || "");
      setLastName(leadDataToEdit.tenant?.secondName || "");
      setEmail(leadDataToEdit.tenant?.email || "");
      setPhoneMobile(leadDataToEdit.tenant?.mobile || "");
      setBillingAddress(leadDataToEdit.address?.text || "");
      setStreetNumber(leadDataToEdit.address?.streetNumber || "");
      setStreetAddress(leadDataToEdit.address?.streetName || "");
      setSuburb(leadDataToEdit.address?.locality || "");
      setPostcode(leadDataToEdit.address?.postCode?.toString() || "");
      setState(leadDataToEdit.address?.state || "");
      setSelectedProducts({
        gas: leadDataToEdit.services?.gas || false,
        electricity: leadDataToEdit.services?.electricity || false,
        water: false,
        broadband: false,
      });
      setSelectedDate(
        leadDataToEdit.leaseStartDate
          ? new Date(leadDataToEdit.leaseStartDate)
          : new Date()
      );
    }
  }, [leadDataToEdit]);

  const validateFields = () => {
    let isValid = true;
    if (firstName.trim() === "") {
      setFirstNameError("First Name is required.");
      isValid = false;
    }
    if (lastName.trim() === "") {
      setLastNameError("Last Name is required.");
      isValid = false;
    }
    if (phoneMobile.trim() === "") {
      setPhoneMobileError("Mobile number is required.");
      isValid = false;
    }
    if (email.trim() !== "" && !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Invalid email format.");
      isValid = false;
    }
    if (selectedProducts.electricity) {
      if (!nmi.trim()) {
        setNmiError("Required");
        isValid = false;
      } else if (!/^\d{10,11}$/.test(nmi.trim())) {
        setNmiError("NMI must be 10–11 digits.");
        isValid = false;
      } else {
        setNmiError("");
      }
    }
    if (selectedProducts.gas) {
      if (!mirn.trim()) {
        setMirnError("Required");
        isValid = false;
      } else if (!/^\d{10,11}$/.test(mirn.trim())) {
        setMirnError("MIRN must be 10–11 digits.");
        isValid = false;
      } else {
        setMirnError("");
      }
    }
    return isValid;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const toggleProduct = (product) => {
    if (product === "water" || product === "broadband") return;
    setSelectedProducts((prevState) => ({
      ...prevState,
      [product]: !prevState[product],
    }));
  };

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const changeMonth = (delta) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + delta,
      1
    );
    setCurrentDate(newDate);
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = date.toDateString() === selectedDate.toDateString();
      days.push(
        <div
          key={`day-${day}`}
          className={`day ${isSelected ? "selected" : ""}`}
          onClick={() => handleDateSelect(date)}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  const handleBillingAddressChange = async (e) => {
    const value = e.target.value;
    setBillingAddress(value);
    if (value.length >= 3) {
      try {
        const response = await api.get(
          `/crm/address-autocomplete/?query=${encodeURIComponent(value)}`
        );
        setAddressSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setAddressSuggestions([]);
      }
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleSuggestionClick = (item) => {
    setBillingAddress(item.display_name);
    const addr = item.address || {};
    setStreetAddress(addr.road || "Auto populate");
    setSuburb(addr.suburb || addr.city || addr.town || "Auto populate");
    setPostcode(addr.postcode || "Auto populate");
    setState(addr.state || "Auto populate");
    setStreetNumber(addr.house_number || "");
    setAddressSuggestions([]);
  };

  const createPayload = () => {
    return {
      tenant: {
        firstName: firstName,
        secondName: lastName,
        email: email,
        mobile: phoneMobile,
      },
      address: {
        text: billingAddress,
        unit: "",
        streetNumber: streetNumber,
        streetName: streetAddress,
        locality: suburb,
        postCode: isNaN(parseInt(postcode, 10)) ? 0 : parseInt(postcode, 10),
        state: state,
        city: "",
        country: "",
      },
      referringAgent: {
        name: agentName,
        email: "",
        partnerCode: "",
      },
      referringAgency: {
        name: agencyName,
        email: "",
        partnerCode: "",
      },
      services: {
        gas: selectedProducts.gas,
        electricity: selectedProducts.electricity,
        internet: false,
        telephone: false,
        payTV: false,
        cleaning: false,
        removalist: false,
        movingBoxes: false,
        vehicleHire: false,
        water: false,
      },
      submitted: new Date().toISOString(),
      leaseStartDate: selectedDate.toISOString().split("T")[0],
      renewal: false,
      nmi: nmi,
      mirn: mirn,
    };
  };

  const handleSave = async (e, forConvert = false) => {
    e.preventDefault();
    if (!validateFields()) {
      showErrorAlert("Please correct the errors in the form.");
      return;
    }
    const payload = createPayload();
    try {
      const response = await api.post("/crm/flk/save-lead/", payload);
      if (forConvert) {
        return response.data;
      } else {
        if (response.data.done) {
          showSuccessAlert("Leads saved successfully!");
        } else {
          showErrorAlert("Operation not succeeded!");
        }
      }
    } catch (error) {
      console.error(
        "Submission failed:",
        error.response?.data || error.message
      );
      showErrorAlert(error.response?.data || error.message);
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      showErrorAlert("Please correct the errors in the form.");
      return;
    }
    const resp = await handleSave(e, true);
    if (resp && resp.done) {
      navigate("/signup-form", { state: { lead: resp.data } });
    } else {
      showErrorAlert("Operation not succeeded!");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar
        style={{ width: "25%" }}
        className="w-1/4 h-screen fixed md:relative"
      />
      <main
        className="flex-1 overflow-y-auto h-screen"
        style={{ width: "75%" }}
      >
        <div className="lead-capture-form relative">
          <button
            onClick={() => navigate("/dashboard")}
            className="back-button"
          >
            Back
          </button>
          <h1 className="form-title">Lead Capture Form</h1>
          <div className="form-section">
            <h2 className="section-title">
              Step 1: <span className="section-subtitle">Customer Details</span>
            </h2>
            <div className="form-fields-grid">
              <div className="form-field">
                <label>
                  <span className="text-sm text-red-500">*</span> First Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (e.target.value.trim() !== "") setFirstNameError("");
                  }}
                />
                {firstNameError && (
                  <span className="error-message" style={{ color: "red" }}>
                    {firstNameError}
                  </span>
                )}
              </div>
              <div className="form-field">
                <label>
                  <span className="text-sm text-red-500">*</span> Last Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (e.target.value.trim() !== "") setLastNameError("");
                  }}
                />
                {lastNameError && (
                  <span className="error-message" style={{ color: "red" }}>
                    {lastNameError}
                  </span>
                )}
              </div>
              <div className="form-field">
                <label>
                  <span className="text-sm text-red-500">*</span> Contact
                  Number:
                </label>
                <input
                  type="text"
                  placeholder="Enter your contact number"
                  value={phoneMobile}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/[^0-9]/.test(inputValue)) {
                      setPhoneMobileError("Only numbers are allowed.");
                    } else {
                      setPhoneMobileError("");
                    }
                    setPhoneMobile(inputValue.replace(/\D/g, ""));
                  }}
                />
                {phoneMobileError && (
                  <span className="error-message" style={{ color: "red" }}>
                    {phoneMobileError}
                  </span>
                )}
              </div>
              <div className="form-field">
                <label>Email Address:</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (
                      e.target.value.trim() === "" ||
                      /^\S+@\S+\.\S+$/.test(e.target.value)
                    )
                      setEmailError("");
                  }}
                />
                {emailError && (
                  <span className="error-message" style={{ color: "red" }}>
                    {emailError}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="form-section">
            <h2 className="section-title">
              Step 2: <span className="section-subtitle">Move-In Address</span>
            </h2>
            <div className="form-fields-grid">
              <div className="form-field billing-address">
                <label>Billing Address:</label>
                <div className="relative bg-yellow-400 rounded-md p-2 mt-1">
                  <input
                    type="text"
                    value={billingAddress}
                    onChange={handleBillingAddressChange}
                    className="bg-transparent border-none outline-none w-[calc(100%-30px)] font-medium"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Check size={20} color="#000" />
                  </div>
                  <div className="text-xs text-right mt-1">Map Reference</div>
                  {addressSuggestions.length > 0 && (
                    <ul className="absolute left-0 top-full mt-1 w-full max-h-48 overflow-y-auto border border-gray-300 bg-white z-50 list-none p-0">
                      {addressSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="p-2 cursor-pointer hover:bg-gray-100 text-black"
                        >
                          {suggestion.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="form-field">
                <label>Street Address:</label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Suburb:</label>
                <input
                  type="text"
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Postcode:</label>
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>State:</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>
            <div className="form-field product-section">
              <label>What products do you need?</label>
              <div className="product-row">
                <div className="product-column">
                  <button
                    className={`product-button ${
                      selectedProducts.electricity
                        ? "selected"
                        : "default-yellow"
                    }`}
                    onClick={() => toggleProduct("electricity")}
                  >
                    Electricity
                  </button>
                  {selectedProducts.electricity && (
                    <div className="product-input-block">
                      <label className="product-input-label">NMI:</label>
                      <input
                        type="text"
                        maxLength={11}
                        value={nmi}
                        placeholder="upto 11 digits"
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          );
                          setNmi(numericValue);
                          if (nmiError) setNmiError("");
                        }}
                        className="product-input-field"
                      />
                      {nmiError && (
                        <span
                          className="error-message"
                          style={{ color: "red", fontSize: "0.85rem" }}
                        >
                          {nmiError}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="product-column">
                  <button
                    className={`product-button ${
                      selectedProducts.gas ? "selected" : "default-yellow"
                    }`}
                    onClick={() => toggleProduct("gas")}
                  >
                    Gas
                  </button>
                  {selectedProducts.gas && (
                    <div className="product-input-block">
                      <label className="product-input-label">MIRN:</label>
                      <input
                        type="text"
                        maxLength={11}
                        value={mirn}
                        placeholder="upto 11 digits"
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          );
                          setMirn(numericValue);
                          if (mirnError) setMirnError("");
                        }}
                        className="product-input-field"
                      />
                      {mirnError && (
                        <span
                          className="error-message"
                          style={{ color: "red", fontSize: "0.85rem" }}
                        >
                          {mirnError}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="product-column">
                  <button className="product-button water not-activated">
                    Water
                  </button>
                </div>
                <div className="product-column">
                  <button className="product-button broadband not-activated">
                    Broadband
                  </button>
                </div>
              </div>
              <div className="note">(Color red, not activated in phase 1)</div>
            </div>
            <div className="form-field">
              <label>When is your preferred move-in date?</label>
              <div className="date-picker">
                <div
                  className="date-picker-input"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <span>
                    {selectedDate.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <Calendar size={20} color="#fff" />
                </div>
                {showCalendar && (
                  <div className="calendar">
                    <div className="calendar-header">
                      <ChevronLeft
                        size={16}
                        color="#0047AB"
                        className="calendar-nav"
                        onClick={() => changeMonth(-1)}
                      />
                      <span>
                        {monthNames[currentDate.getMonth()]}{" "}
                        {currentDate.getFullYear()}
                      </span>
                      <ChevronRight
                        size={16}
                        color="#0047AB"
                        className="calendar-nav"
                        onClick={() => changeMonth(1)}
                      />
                    </div>
                    <div className="calendar-days">
                      <div className="weekday">Su</div>
                      <div className="weekday">Mo</div>
                      <div className="weekday">Tu</div>
                      <div className="weekday">We</div>
                      <div className="weekday">Th</div>
                      <div className="weekday">Fr</div>
                      <div className="weekday">Sa</div>
                      {renderCalendarDays()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="form-section">
            <h2 className="section-title">
              Step 3:{" "}
              <span className="section-subtitle">
                Real Estate Agent (REA) Details
              </span>
            </h2>
            <div className="form-fields-grid">
              <div className="form-field">
                <label>REA Office Details:</label>
                <input
                  type="text"
                  placeholder="Test"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Referred Agent Name:</label>
                <input
                  type="text"
                  placeholder="Test"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>
                  REA Software Used (if known): (Optional: Name of software used
                  by the REA)
                </label>
                <input
                  type="text"
                  placeholder="Test"
                  value={reaSoftwareUsed}
                  onChange={(e) => setReaSoftwareUsed(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="form-section">
            <h2 className="section-title">
              Step 4: <span className="section-subtitle">Lead Management</span>
            </h2>
            <div className="form-field">
              <label>Internal Use</label>
              <div className="assign-lead-dropdown">
                <div
                  className="assign-lead-button"
                  onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                >
                  Assign Lead
                  <ChevronDown size={20} color="white" />
                </div>
                {showAgentDropdown && (
                  <div className="agent-dropdown">
                    <div className="agent-option">( Select Agent )</div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={(e) => handleSave(e)}
                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={(e) => handleConnect(e)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Convert
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeadCaptureForm;
