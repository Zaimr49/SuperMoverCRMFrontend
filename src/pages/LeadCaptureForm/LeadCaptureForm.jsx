"use client";

import { useState } from "react";
import "./LeadCaptureForm.css";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const LeadCaptureForm = () => {
  // New state for the first four fields and error messages
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneMobile, setPhoneMobile] = useState("");
  const [phoneMobileError, setPhoneMobileError] = useState("");

  // Existing state for the rest of the form
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [billingAddress, setBillingAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({
    electricity: false,
    gas: false,
    water: false,
    broadband: false,
  });
  const [streetAddress, setStreetAddress] = useState("Auto populate");
  const [suburb, setSuburb] = useState("Auto populate");
  const [postCode, setPostCode] = useState("Auto populate");
  const [stateName, setStateName] = useState("Auto populate");
  const [reaOfficeDetails, setReaOfficeDetails] = useState("");
  const [referredAgentName, setReferredAgentName] = useState("");
  const [reaSoftwareUsed, setReaSoftwareUsed] = useState("");

  const navigate = useNavigate();

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

  // Simple field validation function
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
    return isValid;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const toggleProduct = (product) => {
    // Water and broadband are disabled for Phase 1.
    if (product === "water" || product === "broadband") return;
    setSelectedProducts((prevState) => ({
      ...prevState,
      [product]: !prevState[product],
    }));
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

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
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];
    // Empty slots before the first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    // Actual days of the month
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

  // Fetch address suggestions from the backend as the user types
  const handleBillingAddressChange = async (e) => {
    const value = e.target.value;
    setBillingAddress(value);

    if (value.length >= 3) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/leads/address-autocomplete/?query=${encodeURIComponent(
            value
          )}`
        );
        if (response.ok) {
          const suggestions = await response.json();
          setAddressSuggestions(suggestions);
        } else {
          console.error("Error fetching suggestions:", response.statusText);
          setAddressSuggestions([]);
        }
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
    setPostCode(addr.postcode || "Auto populate");
    setStateName(addr.state || "Auto populate");
    setAddressSuggestions([]);
  };

  // Save the current form data (example: using localStorage)
  const handleSave = () => {
    if (!validateFields()) {
      alert("Please correct the errors in the form.");
      return;
    }
    const data = {
      firstName,
      lastName,
      email,
      phoneMobile,
      billingAddress,
      streetAddress,
      suburb,
      postCode,
      stateName,
      selectedProducts,
      moveInDate: selectedDate,
    };
    localStorage.setItem("leadData", JSON.stringify(data));
    alert("Data saved!");
  };

  // Navigate to the signup form page
  const handleConnect = () => {
    if (!validateFields()) {
      alert("Please correct the errors in the form.");
      return;
    }
    const data = {
      firstName,
      lastName,
      email,
      phoneMobile,
      billingAddress,
      streetAddress,
      suburb,
      postCode,
      stateName,
      selectedProducts,
      moveInDate: selectedDate,
      reaOfficeDetails,
      referredAgentName,
      reaSoftwareUsed,
      // Add any additional fields here...
    };
    navigate("/signup-form", { state: data });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar
        style={{ width: "25%" }}
        className="w-1/4 h-screen fixed md:relative"
      />

      {/* Main Content */}
      <main
        className="flex-1 overflow-y-auto h-screen"
        style={{ width: "75%" }}
      >
        <div className="lead-capture-form relative">
          {/* Back button in top-right corner */}
          <button
            onClick={() => navigate("/dashboard")}
            className="back-button"
          >
            Back
          </button>
          <h1 className="form-title">Lead Capture Form</h1>

          {/* Step 1: Customer Details */}
          <div className="form-section">
            <h2 className="section-title">
              Step 1: <span className="section-subtitle">Customer Details</span>
            </h2>
            <div className="form-fields-grid">
              <div className="form-field">
                <label>
                  <span class="text-sm text-red-500">*</span>
                  First Name:
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
                  <span class="text-sm text-red-500">*</span>Last Name:
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
                  <span class="text-sm text-red-500">*</span>Contact Number:
                </label>
                <input
                  type="text"
                  placeholder="Enter your contact number"
                  value={phoneMobile}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // If any non-digit is detected, show error.
                    if (/[^0-9]/.test(inputValue)) {
                      setPhoneMobileError("Only numbers are allowed.");
                    } else {
                      setPhoneMobileError("");
                    }
                    // Remove non-digit characters and update state.
                    const numericValue = inputValue.replace(/\D/g, "");
                    setPhoneMobile(numericValue);
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

          {/* Step 2: Move-In Address */}
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
                <input type="text" value={streetAddress} readOnly />
              </div>
              <div className="form-field">
                <label>Suburb:</label>
                <input type="text" value={suburb} readOnly />
              </div>
              <div className="form-field">
                <label>Postcode:</label>
                <input type="text" value={postCode} readOnly />
              </div>
              <div className="form-field">
                <label>State:</label>
                <input type="text" value={stateName} readOnly />
              </div>
            </div>

            <div className="form-field product-section">
              <label>What products do you need?</label>
              <div className="product-buttons">
                <button
                  className={`product-button ${
                    selectedProducts.electricity ? "selected" : "default-yellow"
                  }`}
                  onClick={() => toggleProduct("electricity")}
                >
                  Electricity
                </button>
                <button
                  className={`product-button ${
                    selectedProducts.gas ? "selected" : "default-yellow"
                  }`}
                  onClick={() => toggleProduct("gas")}
                >
                  Gas
                </button>
                <button className="product-button water not-activated">
                  Water
                </button>
                <button className="product-button broadband not-activated">
                  Broadband
                </button>
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

          {/* Step 3: Real Estate Agent (REA) Details */}
          <div className="form-section">
            <h2 className="section-title">
              Step 3:{" "}
              <span className="section-subtitle">
                Real Estate Agent (REA) Details
              </span>
            </h2>
            <div className="form-fields-grid">
              {/* <div className="form-field">
                <label>REA Office Details:</label>
                <input type="text" placeholder="Test" />
              </div>
              <div className="form-field">
                <label>Referred Agent Name:</label>
                <input type="text" placeholder="Test" />
              </div>
              <div className="form-field">
                <label>
                  REA Software Used (if known):
                  <br />
                  (Optional: Name of software used by the REA)
                </label>
                <input type="text" placeholder="Test" />
              </div> */}
              <div className="form-field">
                <label>REA Office Details:</label>
                <input
                  type="text"
                  placeholder="Enter office details"
                  value={reaOfficeDetails}
                  onChange={(e) => setReaOfficeDetails(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Referred Agent Name:</label>
                <input
                  type="text"
                  placeholder="Enter agent name"
                  value={referredAgentName}
                  onChange={(e) => setReferredAgentName(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>
                  REA Software Used (if known):
                  <br />
                  (Optional: Name of software used by the REA)
                </label>
                <input
                  type="text"
                  placeholder="Enter software name"
                  value={reaSoftwareUsed}
                  onChange={(e) => setReaSoftwareUsed(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Step 4: Lead Management */}
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
          </div>

          {/* Save and Convert Buttons */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={handleConnect}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Convert
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeadCaptureForm;
