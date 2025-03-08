// Code 1
// "use client";

// import { useState } from "react";
// import "./LeadCaptureForm.css";
// import {
//   Check,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Calendar,
// } from "lucide-react";

// const LeadCaptureForm = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [billingAddress, setBillingAddress] = useState(
//     "49 High Street Road, Ashwood 3147 VIC"
//   );
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [showAgentDropdown, setShowAgentDropdown] = useState(false);
//   const [selectedProducts, setSelectedProducts] = useState({
//     electricity: false,
//     gas: false,
//     water: false,
//     broadband: false,
//   });

//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const handleDateSelect = (date) => {
//     setSelectedDate(date);
//     setShowCalendar(false);
//   };

//   const toggleProduct = (product) => {
//     if (product === "water" || product === "broadband") return;
//     setSelectedProducts((prevState) => ({
//       ...prevState,
//       [product]: !prevState[product],
//     }));
//   };

//   const getDaysInMonth = (year, month) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (year, month) => {
//     return new Date(year, month, 1).getDay();
//   };

//   const changeMonth = (delta) => {
//     const newDate = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth() + delta,
//       1
//     );
//     setCurrentDate(newDate);
//   };

//   const renderCalendarDays = () => {
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth();
//     const daysInMonth = getDaysInMonth(year, month);
//     const firstDayOfMonth = getFirstDayOfMonth(year, month);

//     const days = [];
//     for (let i = 0; i < firstDayOfMonth; i++) {
//       days.push(<div key={`empty-${i}`} className="day empty"></div>);
//     }

//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month, day);
//       const isSelected = date.toDateString() === selectedDate.toDateString();
//       days.push(
//         <div
//           key={`day-${day}`}
//           className={`day ${isSelected ? "selected" : ""}`}
//           onClick={() => handleDateSelect(date)}
//         >
//           {day}
//         </div>
//       );
//     }

//     return days;
//   };

//   return (
//     <div className="lead-capture-form">
//       <h1 className="form-title">Lead Capture Form</h1>

//       <div className="form-section">
//         <h2 className="section-title">
//           Step 1: <span className="section-subtitle">Customer Details</span>
//         </h2>

//         <div className="form-field">
//           <label>First Name:</label>
//           <input type="text" placeholder="Enter your first name" />
//         </div>

//         <div className="form-field">
//           <label>Last Name:</label>
//           <input type="text" placeholder="Enter your last name" />
//         </div>

//         <div className="form-field">
//           <label>Contact Number:</label>
//           <input type="text" placeholder="Enter your contact number" />
//         </div>

//         <div className="form-field">
//           <label>Email Address:</label>
//           <input type="email" placeholder="Enter your email address" />
//         </div>
//       </div>

//       <div className="form-section">
//         <h2 className="section-title">
//           Step 2: <span className="section-subtitle">Move-In Address</span>
//         </h2>

//         <div className="form-field billing-address">
//           <label>Billing Address:</label>
//           <div className="billing-address-input">
//             <input
//               type="text"
//               value={billingAddress}
//               onChange={(e) => setBillingAddress(e.target.value)}
//             />
//             <div className="check-icon">
//               <Check size={20} color="#000" />
//             </div>
//             <div className="map-reference">Map Reference</div>
//           </div>
//         </div>

//         <div className="form-field">
//           <label>Street Address:</label>
//           <input type="text" defaultValue="Auto populate" />
//         </div>

//         <div className="form-field">
//           <label>Suburb:</label>
//           <input type="text" defaultValue="Auto populate" />
//         </div>

//         <div className="form-field">
//           <label>Postcode:</label>
//           <input type="text" defaultValue="Auto populate" />
//         </div>

//         <div className="form-field">
//           <label>State:</label>
//           <input type="text" defaultValue="Auto populate" />
//         </div>

//         <div className="form-field">
//           <label>What products do you need?</label>
//           <div className="product-buttons">
//             <button
//               className={`product-button ${
//                 selectedProducts.electricity ? "selected" : "default-yellow"
//               }`}
//               onClick={() => toggleProduct("electricity")}
//             >
//               Electricity
//             </button>
//             <button
//               className={`product-button ${
//                 selectedProducts.gas ? "selected" : "default-yellow"
//               }`}
//               onClick={() => toggleProduct("gas")}
//             >
//               Gas
//             </button>
//             <button className="product-button water not-activated">
//               Water
//             </button>
//             <button className="product-button broadband not-activated">
//               Broadband
//             </button>
//           </div>
//           <div className="note">(Color red, not activated in phase 1)</div>
//         </div>

//         <div className="form-field">
//           <label>When is your preferred move-in date?</label>
//           <div className="date-picker">
//             <div
//               className="date-picker-input"
//               onClick={() => setShowCalendar(!showCalendar)}
//             >
//               <span>
//                 {selectedDate.toLocaleDateString("en-US", {
//                   day: "numeric",
//                   month: "long",
//                   year: "numeric",
//                 })}
//               </span>
//               <Calendar size={20} color="#fff" />
//             </div>

//             {showCalendar && (
//               <div className="calendar">
//                 <div className="calendar-header">
//                   <ChevronLeft
//                     size={16}
//                     color="#0047AB"
//                     className="calendar-nav"
//                     onClick={() => changeMonth(-1)}
//                   />
//                   <span>
//                     {monthNames[currentDate.getMonth()]}{" "}
//                     {currentDate.getFullYear()}
//                   </span>
//                   <ChevronRight
//                     size={16}
//                     color="#0047AB"
//                     className="calendar-nav"
//                     onClick={() => changeMonth(1)}
//                   />
//                 </div>

//                 <div className="calendar-days">
//                   <div className="weekday">Su</div>
//                   <div className="weekday">Mo</div>
//                   <div className="weekday">Tu</div>
//                   <div className="weekday">We</div>
//                   <div className="weekday">Th</div>
//                   <div className="weekday">Fr</div>
//                   <div className="weekday">Sa</div>

//                   {renderCalendarDays()}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="form-section">
//         <h2 className="section-title">
//           Step 3:{" "}
//           <span className="section-subtitle">
//             Real Estate Agent (REA) Details
//           </span>
//         </h2>

//         <div className="form-field">
//           <label>REA Office Details:</label>
//           <input type="text" placeholder="Test" />
//         </div>

//         <div className="form-field">
//           <label>Refered Agent Name:</label>
//           <input type="text" placeholder="Test" />
//         </div>

//         <div className="form-field">
//           <label>
//             REA Software Used (if known): (Optional: Name of software used by
//             the REA)
//           </label>
//           <input type="text" placeholder="Test" />
//         </div>
//       </div>

//       <div className="form-section">
//         <h2 className="section-title">
//           Step 4: <span className="section-subtitle">Lead Management</span>
//         </h2>

//         <div className="form-field">
//           <label>Internal Use</label>
//           <div className="assign-lead-dropdown">
//             <div
//               className="assign-lead-button"
//               onClick={() => setShowAgentDropdown(!showAgentDropdown)}
//             >
//               Assign Lead
//               <ChevronDown size={20} color="white" />
//             </div>

//             {showAgentDropdown && (
//               <div className="agent-dropdown">
//                 <div className="agent-option">( Select Agent )</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadCaptureForm;

// Code 2
// "use client";

// import { useState } from "react";
// import "./LeadCaptureForm.css";
// import {
//   Check,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Calendar,
// } from "lucide-react";

// const LeadCaptureForm = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [billingAddress, setBillingAddress] = useState(
//     "49 High Street Road, Ashwood 3147 VIC"
//   );
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [showAgentDropdown, setShowAgentDropdown] = useState(false);
//   const [selectedProducts, setSelectedProducts] = useState({
//     electricity: false,
//     gas: false,
//     water: false,
//     broadband: false,
//   });

//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const handleDateSelect = (date) => {
//     setSelectedDate(date);
//     setShowCalendar(false);
//   };

//   const toggleProduct = (product) => {
//     // Water and broadband are disabled for Phase 1.
//     if (product === "water" || product === "broadband") return;
//     setSelectedProducts((prevState) => ({
//       ...prevState,
//       [product]: !prevState[product],
//     }));
//   };

//   const getDaysInMonth = (year, month) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (year, month) => {
//     return new Date(year, month, 1).getDay();
//   };

//   const changeMonth = (delta) => {
//     const newDate = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth() + delta,
//       1
//     );
//     setCurrentDate(newDate);
//   };

//   const renderCalendarDays = () => {
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth();
//     const daysInMonth = getDaysInMonth(year, month);
//     const firstDayOfMonth = getFirstDayOfMonth(year, month);

//     const days = [];
//     // Empty slots before the first day
//     for (let i = 0; i < firstDayOfMonth; i++) {
//       days.push(<div key={`empty-${i}`} className="day empty"></div>);
//     }

//     // Actual days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month, day);
//       const isSelected = date.toDateString() === selectedDate.toDateString();
//       days.push(
//         <div
//           key={`day-${day}`}
//           className={`day ${isSelected ? "selected" : ""}`}
//           onClick={() => handleDateSelect(date)}
//         >
//           {day}
//         </div>
//       );
//     }

//     return days;
//   };

//   return (
//     <div className="lead-capture-form">
//       <h1 className="form-title">Lead Capture Form</h1>

//       {/* Step 1: Customer Details */}
//       <div className="form-section">
//         <h2 className="section-title">
//           Step 1: <span className="section-subtitle">Customer Details</span>
//         </h2>
//         <div className="form-fields-grid">
//           <div className="form-field">
//             <label>First Name:</label>
//             <input type="text" placeholder="Enter your first name" />
//           </div>

//           <div className="form-field">
//             <label>Last Name:</label>
//             <input type="text" placeholder="Enter your last name" />
//           </div>

//           <div className="form-field">
//             <label>Contact Number:</label>
//             <input type="text" placeholder="Enter your contact number" />
//           </div>

//           <div className="form-field">
//             <label>Email Address:</label>
//             <input type="email" placeholder="Enter your email address" />
//           </div>
//         </div>
//       </div>

//       {/* Step 2: Move-In Address */}
//       <div className="form-section">
//         <h2 className="section-title">
//           Step 2: <span className="section-subtitle">Move-In Address</span>
//         </h2>
//         <div className="form-fields-grid">
//           <div className="form-field billing-address">
//             <label>Billing Address:</label>
//             <div className="billing-address-input">
//               <input
//                 type="text"
//                 value={billingAddress}
//                 onChange={(e) => setBillingAddress(e.target.value)}
//               />
//               <div className="check-icon">
//                 <Check size={20} color="#000" />
//               </div>
//               <div className="map-reference">Map Reference</div>
//             </div>
//           </div>

//           <div className="form-field">
//             <label>Street Address:</label>
//             <input type="text" defaultValue="Auto populate" />
//           </div>

//           <div className="form-field">
//             <label>Suburb:</label>
//             <input type="text" defaultValue="Auto populate" />
//           </div>

//           <div className="form-field">
//             <label>Postcode:</label>
//             <input type="text" defaultValue="Auto populate" />
//           </div>

//           <div className="form-field">
//             <label>State:</label>
//             <input type="text" defaultValue="Auto populate" />
//           </div>
//         </div>

//         <div className="form-field product-section">
//           <label>What products do you need?</label>
//           <div className="product-buttons">
//             <button
//               className={`product-button ${
//                 selectedProducts.electricity ? "selected" : "default-yellow"
//               }`}
//               onClick={() => toggleProduct("electricity")}
//             >
//               Electricity
//             </button>
//             <button
//               className={`product-button ${
//                 selectedProducts.gas ? "selected" : "default-yellow"
//               }`}
//               onClick={() => toggleProduct("gas")}
//             >
//               Gas
//             </button>
//             <button className="product-button water not-activated">
//               Water
//             </button>
//             <button className="product-button broadband not-activated">
//               Broadband
//             </button>
//           </div>
//           <div className="note">(Color red, not activated in phase 1)</div>
//         </div>

//         <div className="form-field">
//           <label>When is your preferred move-in date?</label>
//           <div className="date-picker">
//             <div
//               className="date-picker-input"
//               onClick={() => setShowCalendar(!showCalendar)}
//             >
//               <span>
//                 {selectedDate.toLocaleDateString("en-US", {
//                   day: "numeric",
//                   month: "long",
//                   year: "numeric",
//                 })}
//               </span>
//               <Calendar size={20} color="#fff" />
//             </div>

//             {showCalendar && (
//               <div className="calendar">
//                 <div className="calendar-header">
//                   <ChevronLeft
//                     size={16}
//                     color="#0047AB"
//                     className="calendar-nav"
//                     onClick={() => changeMonth(-1)}
//                   />
//                   <span>
//                     {monthNames[currentDate.getMonth()]}{" "}
//                     {currentDate.getFullYear()}
//                   </span>
//                   <ChevronRight
//                     size={16}
//                     color="#0047AB"
//                     className="calendar-nav"
//                     onClick={() => changeMonth(1)}
//                   />
//                 </div>

//                 <div className="calendar-days">
//                   <div className="weekday">Su</div>
//                   <div className="weekday">Mo</div>
//                   <div className="weekday">Tu</div>
//                   <div className="weekday">We</div>
//                   <div className="weekday">Th</div>
//                   <div className="weekday">Fr</div>
//                   <div className="weekday">Sa</div>

//                   {renderCalendarDays()}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Step 3: Real Estate Agent (REA) Details */}
//       <div className="form-section">
//         <h2 className="section-title">
//           Step 3:{" "}
//           <span className="section-subtitle">
//             Real Estate Agent (REA) Details
//           </span>
//         </h2>
//         <div className="form-fields-grid">
//           <div className="form-field">
//             <label>REA Office Details:</label>
//             <input type="text" placeholder="Test" />
//           </div>

//           <div className="form-field">
//             <label>Referred Agent Name:</label>
//             <input type="text" placeholder="Test" />
//           </div>

//           <div className="form-field">
//             <label>
//               REA Software Used (if known): (Optional: Name of software used by
//               the REA)
//             </label>
//             <input type="text" placeholder="Test" />
//           </div>
//         </div>
//       </div>

//       {/* Step 4: Lead Management */}
//       <div className="form-section">
//         <h2 className="section-title">
//           Step 4: <span className="section-subtitle">Lead Management</span>
//         </h2>
//         <div className="form-field">
//           <label>Internal Use</label>
//           <div className="assign-lead-dropdown">
//             <div
//               className="assign-lead-button"
//               onClick={() => setShowAgentDropdown(!showAgentDropdown)}
//             >
//               Assign Lead
//               <ChevronDown size={20} color="white" />
//             </div>

//             {showAgentDropdown && (
//               <div className="agent-dropdown">
//                 <div className="agent-option">( Select Agent )</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadCaptureForm;

// Code 3
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

const LeadCaptureForm = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [billingAddress, setBillingAddress] = useState(
    "49 High Street Road, Ashwood 3147 VIC"
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({
    electricity: false,
    gas: false,
    water: false,
    broadband: false,
  });

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

  return (
    <div className="lead-capture-form">
      <h1 className="form-title">Lead Capture Form</h1>

      {/* Step 1: Customer Details */}
      <div className="form-section">
        <h2 className="section-title">
          Step 1: <span className="section-subtitle">Customer Details</span>
        </h2>
        <div className="form-fields-grid">
          <div className="form-field">
            <label>First Name:</label>
            <input type="text" placeholder="Enter your first name" />
          </div>

          <div className="form-field">
            <label>Last Name:</label>
            <input type="text" placeholder="Enter your last name" />
          </div>

          <div className="form-field">
            <label>Contact Number:</label>
            <input type="text" placeholder="Enter your contact number" />
          </div>

          <div className="form-field">
            <label>Email Address:</label>
            <input type="email" placeholder="Enter your email address" />
          </div>
        </div>
      </div>

      {/* Step 2: Move-In Address
      <div className="form-section">
        <h2 className="section-title">
          Step 2: <span className="section-subtitle">Move-In Address</span>
        </h2>
        <div className="form-fields-grid">
          <div className="form-field billing-address">
            <label>Billing Address:</label>
            <div className="billing-address-input">
              <input
                type="text"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
              />
              <div className="check-icon">
                <Check size={20} color="#000" />
              </div>
              <div className="map-reference">Map Reference</div>
            </div>
          </div>

          <div className="form-field">
            <label>Street Address:</label>
            <input type="text" defaultValue="Auto populate" />
          </div>

          <div className="form-field">
            <label>Suburb:</label>
            <input type="text" defaultValue="Auto populate" />
          </div>

          <div className="form-field">
            <label>Postcode:</label>
            <input type="text" defaultValue="Auto populate" />
          </div>

          <div className="form-field">
            <label>State:</label>
            <input type="text" defaultValue="Auto populate" />
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
      </div> */}
      {/* Step 2: Move-In Address */}
      <div className="form-section">
        <h2 className="section-title">
          Step 2: <span className="section-subtitle">Move-In Address</span>
        </h2>

        {/* We still use a grid, but the Billing Address will span both columns */}
        <div className="form-fields-grid">
          {/* Billing Address: Full-width */}
          <div className="form-field billing-address">
            <label>Billing Address:</label>
            <div className="billing-address-input">
              <input
                type="text"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
              />
              <div className="check-icon">
                <Check size={20} color="#000" />
              </div>
              <div className="map-reference">Map Reference</div>
            </div>
          </div>

          {/* The following fields are in two columns */}
          <div className="form-field">
            <label>Street Address:</label>
            <input type="text" defaultValue="Auto populate" />
          </div>

          <div className="form-field">
            <label>Suburb:</label>
            <input type="text" defaultValue="Auto populate" />
          </div>

          <div className="form-field">
            <label>Postcode:</label>
            <input type="text" defaultValue="Auto populate" />
          </div>

          <div className="form-field">
            <label>State:</label>
            <input type="text" defaultValue="Auto populate" />
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
          <div className="form-field">
            <label>REA Office Details:</label>
            <input type="text" placeholder="Test" />
          </div>

          <div className="form-field">
            <label>Referred Agent Name:</label>
            <input type="text" placeholder="Test" />
          </div>

          <div className="form-field">
            <label>
              REA Software Used (if known): (Optional: Name of software used by
              the REA)
            </label>
            <input type="text" placeholder="Test" />
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
    </div>
  );
};

export default LeadCaptureForm;
