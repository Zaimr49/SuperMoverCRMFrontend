import React, { useState, useRef, createRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import classNames from "classnames";
import Sidebar from "../components/Sidebar"; // Import Sidebar
import { useNavigate } from "react-router-dom";

/** Utility to combine Tailwind classes. */
function cn(...classes) {
  return classNames(...classes);
}

/** Reusable Button component. */
function Button({ onClick, disabled, className, children, ...props }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        " px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 " +
          "focus:ring-offset-2 transition-colors text-[16px]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default function SignUpForm() {
  // Steps array
  const [steps, setSteps] = useState([
    { id: 1, title: "Sale Type", isOpen: true },
    { id: 2, title: "Customer Details", isOpen: false },
    { id: 3, title: "Account Holder Details", isOpen: false },
    { id: 4, title: "Primary Account Holder Verification", isOpen: false },
    { id: 5, title: "Secondary Contact (Optional)", isOpen: false },
    { id: 6, title: "Move-In Details", isOpen: false },
    { id: 7, title: "Life Support & Concessions", isOpen: false },
    { id: 8, title: "Medical Cooling Concession & Consent", isOpen: false },
    { id: 9, title: "Communication Preferences", isOpen: false },
    { id: 10, title: "Billing & Promotional Contact", isOpen: false },
    { id: 11, title: "Contract Summary & EIC Script", isOpen: false },
    { id: 0, title: "Confirmation & Submission", isOpen: false, isFinal: true },
  ]);

  // State for the date picker (Step 6)
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const stepRefs = useRef({}); // We'll fill in refs for each step
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

  const [currentStep, setCurrentStep] = useState(1);

  // Include fields in formData for All Steps
  const [formData, setFormData] = useState({
    // Step 1 fields:
    connectionType: "", // "moveIn" or "transfer"
    products: [], // e.g. ["electricity","gas","broadband"]
    customerType: "", // "residential" or "business"

    // Step 2 fields:
    title: "",
    firstName: "",
    lastName: "",
    bestContactNumber: "",
    email: "",
    physicalAddress: "",
    isBillingSameAsPhysical: true,
    billingAddress: "",
    howDidYouHear: "",

    // Step 3 fields:
    isOwner: null, // true or false
    hasSolar: null, // true or false

    // Step 4 fields:
    dob: "",
    verificationMethod: "", // e.g. "Driver's License", "Passport", "Medicare"
    idNumber: "",
    idExpiry: "",
    homePhone: "",
    mobilePhone: "",
    confirmEmail: "",

    // Step 5 fields:
    wantsSecondaryContact: null, // true or false
    secondaryTitle: "",
    secondaryFirstName: "",
    secondaryLastName: "",
    secondaryMobile: "",
    secondaryHomePhone: "",
    secondaryEmail: "",

    // Step 6 fields:
    moveInDate: null,
    hasBeenDisconnected12Months: null, // true / false
    hasBuildingElectricalWorks: null, // true / false
    hasClearMeterAccess: null, // true / false

    // Step 7 fields:
    lifeSupport: null, // true/false
    isConcessionHolder: null, // true/false
    concessionType: "",
    concessionCardNumber: "",
    concessionCardStartDate: "",
    concessionCardExpiryDate: "",

    // Step 8:
    medicalCoolingConcession: null, // true/false
    concessionerDeclarationProvided: null, // true/false

    // Step 9:
    consentElectronicBills: null, // true/false
    allCommunicationSameMethod: null, // true/false
    usePrimaryEmailForAll: null, // true/false
    isPostalAddressCorrect: null, // true/false

    // Step 10:
    monthlyBillsOk: null, // yes/no
    promotionalContactConsent: null, // yes/no

    // Step 11:
    hasReviewedMarketOfferSummary: null, // or you can store “true”/“false” if they clicked
    hasReviewedEICScript: null, // or similarly store “true”/“false”
  });

  // Toggle open/close for each step
  const toggleStep = (stepId) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => ({
        ...step,
        isOpen: step.id === stepId ? !step.isOpen : step.isOpen,
      }))
    );
  };

  // Step 1: Single-select for connection type
  const handleConnectionTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, connectionType: type }));
  };

  // Step 1: Multi-select for products
  const handleProductSelect = (product) => {
    setFormData((prev) => {
      const products = prev.products.includes(product)
        ? prev.products.filter((p) => p !== product)
        : [...prev.products, product];
      return { ...prev, products };
    });
  };

  // Step 1: Single-select for customer type
  const handleCustomerTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, customerType: type }));
  };

  // Generic text input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Move to next step
  function handleNextStep() {
    const nextStepId = currentStep + 1;
    const nextStep = steps.find((step) => step.id === nextStepId);

    if (nextStep) {
      setSteps((prevSteps) =>
        prevSteps.map((s) => ({
          ...s,
          isOpen: s.id === nextStepId, // open next step
        }))
      );
      setCurrentStep(nextStepId);

      // Scroll *after* state updates (use a small timeout or useEffect)
      setTimeout(() => {
        stepRefs.current[nextStepId]?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start", // or 'center'
        });
      }, 0);
    } else {
      // If no next step, open final step (id=0)
      setSteps((prevSteps) =>
        prevSteps.map((s) => ({
          ...s,
          isOpen: s.id === 0,
        }))
      );
      setCurrentStep(0);

      setTimeout(() => {
        stepRefs.current[0]?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 0);
    }
  }

  /**
   * Update button/toggle classes to use #1951A4
   */
  const getToggleButtonClasses = (isSelected, isDisabled) => {
    if (isDisabled) {
      return "bg-red-400 text-white cursor-not-allowed text-[16px] font-normal";
    }
    return isSelected
      ? "bg-[#1951A4] hover:bg-[#164685] text-white text-[16px] font-normal"
      : "bg-yellow-400 hover:bg-yellow-500 text-[#1951A4] text-[16px] font-normal";
  };

  // --------- Step 6: Calendar logic ----------
  function changeMonth(offset) {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + offset,
      1
    );
    setCurrentDate(newDate);
  }

  function handleDateSelect(dateObj) {
    setSelectedDate(dateObj);
    setFormData((prev) => ({ ...prev, moveInDate: dateObj }));
    setShowCalendar(false);
  }

  function renderCalendarDays() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const slots = [];

    // Fill in empty days before 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      slots.push(
        <div key={`empty-${i}`} className="text-center text-sm text-gray-300" />
      );
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(year, month, day);
      const isSelected =
        selectedDate && thisDate.toDateString() === selectedDate.toDateString();

      slots.push(
        <div
          key={day}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full cursor-pointer text-sm hover:bg-gray-100",
            isSelected && "bg-[#fec600] text-white font-bold"
          )}
          onClick={() => handleDateSelect(thisDate)}
        >
          {day}
        </div>
      );
    }

    return slots;
  }
  // --------------------------------------------

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
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
        {/* Back Button at Top Right */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => navigate("/lead-capture-form")}
            className="bg-[#ccc] hover:bg-[#bbb] text-white focus:outline-none focus:ring-0"
          >
            Back
          </Button>
        </div>
        {/* // <div className="max-w-6xl mx-auto px-2 py-6 bg-white text-left text-gray-800"> */}
        <div className="px-2 py-6 bg-white text-left text-gray-800">
          {steps.map((step) => {
            // If we haven't created a ref for this step yet, do it now
            if (!stepRefs.current[step.id]) {
              stepRefs.current[step.id] = createRef();
            }

            return (
              <div
                key={step.id}
                ref={stepRefs.current[step.id]}
                className="mb-6"
              >
                {/* Step heading */}
                <button
                  onClick={() => toggleStep(step.id)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h2 className="text-[32px] font-semibold">
                    <span className="text-[#1951A4]">
                      {step.isFinal ? "Final Step" : `Step ${step.id}`}
                    </span>
                    : {step.title}
                  </h2>
                  <ChevronDown
                    className={cn(
                      "h-8 w-8 transition-transform duration-200 text-[#1951A4]",
                      step.isOpen ? "transform rotate-180" : ""
                    )}
                  />
                </button>

                {/* Thinner yellow divider */}
                <div className="border-t border-yellow-400 mt-2 mb-4" />

                {step.isOpen && (
                  <div className="pl-2">
                    {/* STEP 1 CONTENT */}
                    {step.id === 1 && (
                      <>
                        <p className="mb-4 text-[20px]">
                          Let&apos;s start with some basic details to get you
                          connected!
                        </p>

                        {/* Move In / Transfer */}
                        <div className="mb-6 text-[20px]">
                          <p className="font-normal mb-2">
                            Is this a new connection or a transfer?
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={() =>
                                handleConnectionTypeSelect("moveIn")
                              }
                              className={getToggleButtonClasses(
                                formData.connectionType === "moveIn",
                                false
                              )}
                            >
                              Move In
                            </Button>
                            <Button
                              onClick={() =>
                                handleConnectionTypeSelect("transfer")
                              }
                              className={getToggleButtonClasses(
                                formData.connectionType === "transfer",
                                false
                              )}
                            >
                              Transfer
                            </Button>
                          </div>
                        </div>

                        {/* Products */}
                        <div className="mb-6 text-[20px]">
                          <p className="font-normal mb-2">
                            What products do you need?
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={() => handleProductSelect("electricity")}
                              className={getToggleButtonClasses(
                                formData.products.includes("electricity"),
                                false
                              )}
                            >
                              Electricity
                            </Button>
                            <Button
                              onClick={() => handleProductSelect("gas")}
                              className={getToggleButtonClasses(
                                formData.products.includes("gas"),
                                false
                              )}
                            >
                              Gas
                            </Button>
                            <Button
                              onClick={() => handleProductSelect("water")}
                              className={getToggleButtonClasses(
                                formData.products.includes("water"),
                                true // disabled for Phase 1
                              )}
                            >
                              Water
                            </Button>
                            <Button
                              onClick={() => handleProductSelect("broadband")}
                              className={getToggleButtonClasses(
                                formData.products.includes("broadband"),
                                true // disabled for Phase 1
                              )}
                            >
                              Broadband
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            (Color red, not activated in phase 1)
                          </p>
                        </div>

                        {/* Residential / Business */}
                        <div className="mb-6 text-[20px]">
                          <p className="font-normal mb-2">
                            Are you signing up as a:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={() =>
                                handleCustomerTypeSelect("residential")
                              }
                              className={getToggleButtonClasses(
                                formData.customerType === "residential",
                                false
                              )}
                            >
                              Residential Customer
                            </Button>
                            <Button
                              onClick={() =>
                                handleCustomerTypeSelect("business")
                              }
                              className={getToggleButtonClasses(
                                formData.customerType === "business",
                                false
                              )}
                            >
                              Business Customer
                            </Button>
                          </div>
                        </div>

                        {/* Next Step (centered) */}
                        <div className="flex justify-center">
                          <Button
                            onClick={handleNextStep}
                            className="bg-[#1951A4] hover:bg-[#164685] text-white text-[16px]"
                          >
                            Next Step
                          </Button>
                        </div>
                      </>
                    )}

                    {/* STEP 2 CONTENT */}
                    {step.id === 2 && (
                      <>
                        <p className="mb-4 text-[20px]">
                          We&apos;ll need some details to create your account.
                        </p>

                        {/* Title */}
                        <div className="mb-6 text-[20px]">
                          <p className="font-normal mb-2">
                            What&apos;s your title? (Optional)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {["Mr", "Mrs", "Ms", "Miss", "Dr", "Mx"].map(
                              (t) => (
                                <Button
                                  key={t}
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      title: t,
                                    }))
                                  }
                                  className={getToggleButtonClasses(
                                    formData.title === t,
                                    false
                                  )}
                                >
                                  {t}
                                </Button>
                              )
                            )}
                          </div>
                        </div>

                        {/* First Name */}
                        <div className="mb-4">
                          <label className="block mb-1 text-[16px] font-semibold">
                            What&apos;s your first name?
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full border-0 border-b-2 border-blue-600 bg-transparent text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600 placeholder-gray-400 outline-none"
                            placeholder="Jane"
                          />
                        </div>

                        {/* Last Name */}
                        <div className="mb-4">
                          <label className="block mb-1 text-[16px] font-semibold">
                            And your last name?
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full border-0 border-b-2 border-blue-600 bg-transparent text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600 placeholder-gray-400 outline-none"
                            placeholder="Marry"
                          />
                        </div>

                        {/* Best Contact Number */}
                        <div className="mb-4">
                          <label className="block mb-1 text-[16px] font-semibold">
                            Best contact number?
                          </label>
                          <input
                            type="text"
                            name="bestContactNumber"
                            value={formData.bestContactNumber}
                            onChange={handleInputChange}
                            className="w-full border-0 border-b-2 border-blue-600 bg-transparent text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600 placeholder-gray-400 outline-none"
                            placeholder="0432 111 111"
                          />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                          <label className="block mb-1 text-[16px] font-semibold">
                            Your email address?
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full border-0 border-b-2 border-blue-600 bg-transparent text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600 placeholder-gray-400 outline-none"
                            placeholder="Jane@gmail.com.au"
                          />
                        </div>

                        {/* Physical Address */}
                        <div className="mb-4">
                          <label className="block mb-1 text-[16px] font-semibold">
                            What&apos;s your physical address?
                          </label>
                          <input
                            type="text"
                            name="physicalAddress"
                            value={formData.physicalAddress}
                            onChange={handleInputChange}
                            className="w-full border-0 border-b-2 border-blue-600 bg-transparent text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600 placeholder-gray-400 outline-none"
                            placeholder="49 High Street Road, Ashwood VIC 3147"
                          />
                        </div>

                        {/* Billing Address same as Physical? */}
                        <div className="mb-6 text-[20px]">
                          <p className="font-normal mb-2">
                            Is your billing address the same as your physical
                            address?
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  isBillingSameAsPhysical: true,
                                }))
                              }
                              className={getToggleButtonClasses(
                                formData.isBillingSameAsPhysical === true,
                                false
                              )}
                            >
                              Yes
                            </Button>
                            <Button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  isBillingSameAsPhysical: false,
                                }))
                              }
                              className={getToggleButtonClasses(
                                formData.isBillingSameAsPhysical === false,
                                false
                              )}
                            >
                              No
                            </Button>
                          </div>
                        </div>

                        {/* Billing Address (only if "No") */}
                        {!formData.isBillingSameAsPhysical && (
                          <div className="mb-4">
                            <label className="block mb-1 text-[16px] font-semibold">
                              Billing Address
                            </label>
                            <input
                              type="text"
                              name="billingAddress"
                              value={formData.billingAddress}
                              onChange={handleInputChange}
                              className="border border-gray-300 rounded px-3 py-2 w-full"
                              placeholder="49 High Street Road, Ashwood VIC 3147"
                            />
                          </div>
                        )}

                        {/* How did you hear about us? */}
                        <div className="mb-6 text-[20px]">
                          <p className="font-normal mb-2">
                            How did you hear about us?
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {[
                              "REA Office",
                              "Social Media",
                              "Friend/Family Referral",
                              "Advertisement",
                              "Other",
                            ].map((option) => (
                              <Button
                                key={option}
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    howDidYouHear: option,
                                  }))
                                }
                                className={getToggleButtonClasses(
                                  formData.howDidYouHear === option,
                                  false
                                )}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <Button
                            onClick={handleNextStep}
                            className="bg-[#1951A4] hover:bg-[#164685] text-white text-[16px]"
                          >
                            Next Step
                          </Button>
                        </div>
                      </>
                    )}

                    {/* STEP 3 CONTENT */}
                    {step.id === 3 && (
                      <>
                        <p className="mb-4 text-[20px]">
                          A few more details to set up your account.
                        </p>

                        {/* Are you the owner of this property? */}
                        <div className="mb-6 text-[20px]">
                          <p className="font-normal mb-2">
                            Are you the owner of this property?
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  isOwner: true,
                                }))
                              }
                              className={getToggleButtonClasses(
                                formData.isOwner === true,
                                false
                              )}
                            >
                              Yes
                            </Button>
                            <Button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  isOwner: false,
                                }))
                              }
                              className={getToggleButtonClasses(
                                formData.isOwner === false,
                                false
                              )}
                            >
                              No
                            </Button>
                          </div>
                        </div>

                        {/* Does property have solar panels? */}
                        <div className="mb-6 text-[20px]">
                          <p className="font-normal mb-2">
                            Does the property have solar panels installed?
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  hasSolar: true,
                                }))
                              }
                              className={getToggleButtonClasses(
                                formData.hasSolar === true,
                                false
                              )}
                            >
                              Yes
                            </Button>
                            <Button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  hasSolar: false,
                                }))
                              }
                              className={getToggleButtonClasses(
                                formData.hasSolar === false,
                                false
                              )}
                            >
                              No
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <Button
                            onClick={handleNextStep}
                            className="bg-[#1951A4] hover:bg-[#164685] text-white text-[16px]"
                          >
                            Next Step
                          </Button>
                        </div>
                      </>
                    )}

                    {/* STEP 4 CONTENT */}
                    {step.id === 4 && (
                      <>
                        <p className="mb-4 text-[20px]">
                          We need to verify your identity to set up your account
                          securely.
                        </p>

                        {/* Date of Birth */}
                        <div className="mb-4">
                          <label className="block mb-1 text-[16px] font-semibold">
                            What&apos;s your date of birth?
                          </label>
                          <input
                            type="text"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="w-full border-0 border-b-2 border-blue-600 bg-transparent
                                 text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600
                                 placeholder-gray-400 outline-none"
                            placeholder="DD/MM/YYYY"
                          />
                        </div>

                        {/* Identity Verification Method */}
                        <div className="mb-4">
                          <label className="block mb-2 text-[16px] font-semibold">
                            How would you like to verify your identity?
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {["Driver's License", "Passport", "Medicare"].map(
                              (method) => (
                                <Button
                                  key={method}
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      verificationMethod: method,
                                    }))
                                  }
                                  className={getToggleButtonClasses(
                                    formData.verificationMethod === method,
                                    false
                                  )}
                                >
                                  {method}
                                </Button>
                              )
                            )}
                          </div>
                        </div>

                        {/* ID Number */}
                        <div className="mb-4">
                          <label className="block mb-1 text-[16px] font-semibold">
                            Enter your selected ID number:
                          </label>
                          <input
                            type="text"
                            name="idNumber"
                            value={formData.idNumber}
                            onChange={handleInputChange}
                            className="w-full border-0 border-b-2 border-blue-600 bg-transparent
                                 text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600
                                 placeholder-gray-400 outline-none"
                            placeholder="ID number"
                          />
                        </div>

                        {/* Expiry date */}
                        <div className="mb-4">
                          <label className="block mb-1 text-[16px] font-semibold">
                            Expiry date of your ID?
                          </label>
                          <input
                            type="text"
                            name="idExpiry"
                            value={formData.idExpiry}
                            onChange={handleInputChange}
                            className="w-full border-0 border-b-2 border-blue-600 bg-transparent
                                 text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600
                                 placeholder-gray-400 outline-none"
                            placeholder="MM/YYYY"
                          />
                        </div>

                        {/* Home Phone (Optional) */}
                        <div className="mb-4">
                          <label className="block mb-1 text-[16px] font-semibold">
                            Home phone number? (Optional)
                          </label>
                          <input
                            type="text"
                            name="homePhone"
                            value={formData.homePhone}
                            onChange={handleInputChange}
                            className="w-full border-0 border-b-2 border-blue-600 bg-transparent
                                 text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600
                                 placeholder-gray-400 outline-none"
                            placeholder="(07) 1234 5678"
                          />
                        </div>

                        {/* Mobile Number */}
                        <div className="mb-4">
                          <label className="block mb-1 text-[16px] font-semibold">
                            Mobile number?
                          </label>
                          <input
                            type="text"
                            name="mobilePhone"
                            value={formData.mobilePhone}
                            onChange={handleInputChange}
                            className="w-full border-0 border-b-2 border-blue-600 bg-transparent
                                 text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600
                                 placeholder-gray-400 outline-none"
                            placeholder="0432 123 456"
                          />
                        </div>

                        {/* Confirm Email */}
                        <div className="mb-4">
                          <label className="block mb-1 text-[16px] font-semibold">
                            Confirm your email address:
                          </label>
                          <input
                            type="email"
                            name="confirmEmail"
                            value={formData.confirmEmail}
                            onChange={handleInputChange}
                            className="w-full border-0 border-b-2 border-blue-600 bg-transparent
                                 text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600
                                 placeholder-gray-400 outline-none"
                            placeholder="Repeat your email"
                          />
                        </div>

                        <div className="flex justify-center">
                          <Button
                            onClick={handleNextStep}
                            className="bg-[#1951A4] hover:bg-[#164685] text-white text-[16px]"
                          >
                            Next Step
                          </Button>
                        </div>
                      </>
                    )}

                    {/* STEP 5 CONTENT */}
                    {step.id === 5 && (
                      <>
                        <p className="mb-4 text-[20px]">
                          Would you like to add a secondary contact?
                        </p>
                        <div className="flex gap-2 mb-6">
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                wantsSecondaryContact: true,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.wantsSecondaryContact === true,
                              false
                            )}
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                wantsSecondaryContact: false,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.wantsSecondaryContact === false,
                              false
                            )}
                          >
                            No
                          </Button>
                        </div>

                        {formData.wantsSecondaryContact && (
                          <>
                            <p className="mb-4 text-[20px]">
                              Please provide the secondary contact details.
                            </p>

                            {/* Title */}
                            <div className="mb-4">
                              <label className="block mb-1 text-[16px] font-semibold">
                                What&apos;s their title?
                              </label>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {["Mr", "Mrs", "Ms", "Miss", "Dr", "Mx"].map(
                                  (t) => (
                                    <Button
                                      key={t}
                                      onClick={() =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          secondaryTitle: t,
                                        }))
                                      }
                                      className={getToggleButtonClasses(
                                        formData.secondaryTitle === t,
                                        false
                                      )}
                                    >
                                      {t}
                                    </Button>
                                  )
                                )}
                              </div>
                            </div>

                            {/* First Name */}
                            <div className="mb-4">
                              <label className="block mb-1 text-[16px] font-semibold">
                                First name?
                              </label>
                              <input
                                type="text"
                                name="secondaryFirstName"
                                value={formData.secondaryFirstName}
                                onChange={handleInputChange}
                                className="w-full border-0 border-b-2 border-blue-600 bg-transparent
                                     text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600
                                     placeholder-gray-400 outline-none"
                                placeholder="Jane"
                              />
                            </div>

                            {/* Last Name */}
                            <div className="mb-4">
                              <label className="block mb-1 text-[16px] font-semibold">
                                Last name?
                              </label>
                              <input
                                type="text"
                                name="secondaryLastName"
                                value={formData.secondaryLastName}
                                onChange={handleInputChange}
                                className="w-full border-0 border-b-2 border-blue-600 bg-transparent
                                     text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600
                                     placeholder-gray-400 outline-none"
                                placeholder="Marry"
                              />
                            </div>

                            {/* Secondary Mobile Number */}
                            <div className="mb-4">
                              <label className="block mb-1 text-[16px] font-semibold">
                                Secondary mobile number?
                              </label>
                              <input
                                type="text"
                                name="secondaryMobile"
                                value={formData.secondaryMobile}
                                onChange={handleInputChange}
                                className="w-full border-0 border-b-2 border-blue-600 bg-transparent
                                     text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600
                                     placeholder-gray-400 outline-none"
                                placeholder="0432 111 111"
                              />
                            </div>

                            {/* Secondary Home Phone (Optional) */}
                            <div className="mb-4">
                              <label className="block mb-1 text-[16px] font-semibold">
                                Secondary home phone number? (Optional)
                              </label>
                              <input
                                type="text"
                                name="secondaryHomePhone"
                                value={formData.secondaryHomePhone}
                                onChange={handleInputChange}
                                className="w-full border-0 border-b-2 border-blue-600 bg-transparent
                                     text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600
                                     placeholder-gray-400 outline-none"
                                placeholder="(07) 7654 3210"
                              />
                            </div>

                            {/* Secondary Email Address */}
                            <div className="mb-4">
                              <label className="block mb-1 text-[16px] font-semibold">
                                Secondary email address?
                              </label>
                              <input
                                type="email"
                                name="secondaryEmail"
                                value={formData.secondaryEmail}
                                onChange={handleInputChange}
                                className="w-full border-0 border-b-2 border-blue-600 bg-transparent
                                     text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600
                                     placeholder-gray-400 outline-none"
                                placeholder="Jane@gmail.com.au"
                              />
                            </div>
                          </>
                        )}

                        <div className="flex justify-center">
                          <Button
                            onClick={handleNextStep}
                            className="bg-[#1951A4] hover:bg-[#164685] text-white text-[16px]"
                          >
                            Next Step
                          </Button>
                        </div>
                      </>
                    )}

                    {/* STEP 6 CONTENT: Move-In Details (with Tailwind date picker) */}
                    {step.id === 6 && (
                      <>
                        <p className="mb-4 text-[20px]">
                          Let&apos;s get your connection sorted. A few quick
                          questions to ensure a smooth process!
                        </p>

                        {/* 1) Preferred Move-In Date */}
                        <div className="mb-6">
                          <label className="block text-[16px] font-semibold mb-2">
                            When is your preferred move-in date?
                          </label>
                          <div className="relative">
                            {/* 'Date picker input' */}
                            <div
                              className="bg-[#0047ab] text-white px-4 py-2 rounded flex items-center justify-between cursor-pointer w-72"
                              onClick={() => setShowCalendar(!showCalendar)}
                            >
                              <span>
                                {formData.moveInDate
                                  ? formData.moveInDate.toLocaleDateString(
                                      "en-US",
                                      {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      }
                                    )
                                  : "Select a date"}
                              </span>
                              <Calendar size={20} color="#fff" />
                            </div>

                            {showCalendar && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 shadow-lg">
                                {/* Calendar header */}
                                <div className="flex items-center justify-between p-2 border-b border-gray-100 bg-gray-50">
                                  <ChevronLeft
                                    size={16}
                                    color="#0047AB"
                                    className="cursor-pointer"
                                    onClick={() => changeMonth(-1)}
                                  />
                                  <span className="font-semibold text-[#0047ab]">
                                    {monthNames[currentDate.getMonth()]}{" "}
                                    {currentDate.getFullYear()}
                                  </span>
                                  <ChevronRight
                                    size={16}
                                    color="#0047AB"
                                    className="cursor-pointer"
                                    onClick={() => changeMonth(1)}
                                  />
                                </div>

                                {/* Weekdays + Days Grid */}
                                <div className="grid grid-cols-7 gap-2 p-2 text-center">
                                  {[
                                    "Su",
                                    "Mo",
                                    "Tu",
                                    "We",
                                    "Th",
                                    "Fr",
                                    "Sa",
                                  ].map((w) => (
                                    <div
                                      key={w}
                                      className="text-sm font-bold text-gray-500"
                                    >
                                      {w}
                                    </div>
                                  ))}
                                  {renderCalendarDays()}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 2) Disconnected > 12 months? */}
                        <div className="mb-6 text-[20px]">
                          <p className="font-normal mb-2">
                            Has the electricity supply at the property been
                            disconnected for more than 12 months?
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  hasBeenDisconnected12Months: true,
                                }))
                              }
                              className={getToggleButtonClasses(
                                formData.hasBeenDisconnected12Months === true,
                                false
                              )}
                            >
                              Yes
                            </Button>
                            <Button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  hasBeenDisconnected12Months: false,
                                }))
                              }
                              className={getToggleButtonClasses(
                                formData.hasBeenDisconnected12Months === false,
                                false
                              )}
                            >
                              No
                            </Button>
                          </div>

                          {formData.hasBeenDisconnected12Months && (
                            <div className="mt-2 text-sm text-gray-700 bg-yellow-100 p-2 rounded">
                              <p>
                                A Certificate of Compliance (COC) for electrical
                                work is required, and the connection may be
                                delayed.
                              </p>
                              <p>
                                Please obtain the COC and email it to{" "}
                                <strong>info@supermovers.com.au</strong> as soon
                                as possible.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* 3) Building / Electrical Works? */}
                        <div className="mb-6 text-[20px]">
                          <p className="font-normal mb-2">
                            Have there been any building or electrical works
                            completed, in progress, or scheduled before your
                            connection date?
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  hasBuildingElectricalWorks: true,
                                }))
                              }
                              className={getToggleButtonClasses(
                                formData.hasBuildingElectricalWorks === true,
                                false
                              )}
                            >
                              Yes
                            </Button>
                            <Button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  hasBuildingElectricalWorks: false,
                                }))
                              }
                              className={getToggleButtonClasses(
                                formData.hasBuildingElectricalWorks === false,
                                false
                              )}
                            >
                              No
                            </Button>
                          </div>

                          {formData.hasBuildingElectricalWorks && (
                            <div className="mt-2 text-sm text-gray-700 bg-yellow-100 p-2 rounded">
                              <p>
                                Our service team may need to arrange a manual
                                connection. We&apos;ll contact you with further
                                details.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* 4) Clear & Safe Access? */}
                        <div className="mb-6 text-[20px]">
                          <p className="font-normal mb-2">
                            Is there clear and safe access to the electricity
                            meter?
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  hasClearMeterAccess: true,
                                }))
                              }
                              className={getToggleButtonClasses(
                                formData.hasClearMeterAccess === true,
                                false
                              )}
                            >
                              Yes
                            </Button>
                            <Button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  hasClearMeterAccess: false,
                                }))
                              }
                              className={getToggleButtonClasses(
                                formData.hasClearMeterAccess === false,
                                false
                              )}
                            >
                              No
                            </Button>
                          </div>

                          {formData.hasClearMeterAccess === false && (
                            <div className="mt-2 text-sm text-gray-700 bg-yellow-100 p-2 rounded">
                              <p>
                                If your energy distributor needs to access the
                                meter but cannot do so safely, your connection
                                may be delayed, and additional charges may
                                apply.
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-center">
                          <Button
                            onClick={handleNextStep}
                            className="bg-[#1951A4] hover:bg-[#164685] text-white text-[16px]"
                          >
                            Next Step
                          </Button>
                        </div>
                      </>
                    )}

                    {/* STEP 7 CONTENT */}
                    {step.id === 7 && (
                      <>
                        <p className="mb-4 text-[20px]">
                          We want to ensure you have the necessary support and
                          benefits.
                        </p>

                        {/* Life Support Question */}
                        <p className="mb-2 text-[16px]">
                          Do you or anyone at the property rely on life support
                          equipment that requires electricity?
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                lifeSupport: true,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.lifeSupport === true,
                              false
                            )}
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                lifeSupport: false,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.lifeSupport === false,
                              false
                            )}
                          >
                            No
                          </Button>
                        </div>

                        {formData.lifeSupport && (
                          <p className="bg-yellow-100 text-sm text-gray-700 p-2 rounded mb-6">
                            We’ll include a Life Support Form in your welcome
                            pack for you and your medical practitioner to
                            complete. If you have life support equipment powered
                            by gas, please notify your current gas retailer.
                          </p>
                        )}

                        {/* Concession Card Question */}
                        <p className="mb-2 text-[16px]">
                          Are you a Concession Card holder?
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                isConcessionHolder: true,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.isConcessionHolder === true,
                              false
                            )}
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                isConcessionHolder: false,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.isConcessionHolder === false,
                              false
                            )}
                          >
                            No
                          </Button>
                        </div>

                        {/* Concession Card Details */}
                        {formData.isConcessionHolder && (
                          <>
                            <p className="text-sm text-gray-500 mb-4">
                              (If yes, please provide your concession card
                              details.)
                            </p>

                            {/* Concession Types (buttons) */}
                            <div className="mb-4">
                              <p className="font-semibold text-[16px] mb-2">
                                Concession Type:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  "Commonwealth Seniors Health Card",
                                  "DVA Gold Card (Special Rate TPI Pension Only)",
                                  "DVA Pension Concession Card",
                                  "Department of Veterans Affairs (DVA) Gold Card",
                                  "Health Care Card",
                                  "Pensioner Concession Card",
                                ].map((type) => (
                                  <Button
                                    key={type}
                                    onClick={() =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        concessionType: type,
                                      }))
                                    }
                                    className={getToggleButtonClasses(
                                      formData.concessionType === type,
                                      false
                                    )}
                                  >
                                    {type}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Concession Card Number */}
                            <div className="mb-4">
                              <label className="block mb-1 text-[16px] font-semibold">
                                Concession Card Number:
                              </label>
                              <input
                                type="text"
                                name="concessionCardNumber"
                                value={formData.concessionCardNumber}
                                onChange={handleInputChange}
                                className="w-full border-0 border-b-2 border-blue-600 bg-transparent
                       text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600
                       placeholder-gray-400 outline-none"
                                placeholder="e.g. 1234-5678-XX"
                              />
                            </div>

                            {/* Concession Card Start Date */}
                            <div className="mb-4">
                              <label className="block mb-1 text-[16px] font-semibold">
                                Concession Card Start Date:
                              </label>
                              <input
                                type="text"
                                name="concessionCardStartDate"
                                value={formData.concessionCardStartDate}
                                onChange={handleInputChange}
                                className="w-full border-0 border-b-2 border-blue-600 bg-transparent
                       text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600
                       placeholder-gray-400 outline-none"
                                placeholder="DD/MM/YYYY"
                              />
                            </div>

                            {/* Concession Card Expiry Date */}
                            <div className="mb-6">
                              <label className="block mb-1 text-[16px] font-semibold">
                                Concession Card Expiry Date:
                              </label>
                              <input
                                type="text"
                                name="concessionCardExpiryDate"
                                value={formData.concessionCardExpiryDate}
                                onChange={handleInputChange}
                                className="w-full border-0 border-b-2 border-blue-600 bg-transparent
                       text-[16px] text-gray-900 focus:ring-0 focus:border-blue-600
                       placeholder-gray-400 outline-none"
                                placeholder="DD/MM/YYYY"
                              />
                            </div>
                          </>
                        )}

                        {/* Next Step Button */}
                        <div className="flex justify-center">
                          <Button
                            onClick={handleNextStep}
                            className="bg-[#1951A4] hover:bg-[#164685] text-white text-[16px]"
                          >
                            Next Step
                          </Button>
                        </div>
                      </>
                    )}

                    {/* STEP 8 CONTENT */}
                    {step.id === 8 && (
                      <>
                        <p className="mb-4 text-[20px]">
                          We want to ensure you receive any eligible
                          concessions.
                        </p>

                        {/* 1) Medical Cooling Concession */}
                        <p className="mb-2 text-[16px]">
                          Do you have a Medical Cooling Concession?
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                medicalCoolingConcession: true,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.medicalCoolingConcession === true,
                              false
                            )}
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                medicalCoolingConcession: false,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.medicalCoolingConcession === false,
                              false
                            )}
                          >
                            No
                          </Button>
                        </div>

                        {formData.medicalCoolingConcession && (
                          <p className="mb-4 text-sm text-gray-700 bg-yellow-100 p-2 rounded">
                            Please review the attached Concession Consent Script
                            before proceeding.
                          </p>
                        )}

                        {/* 2) Concessioner Declaration */}
                        <p className="mb-2 text-[16px]">
                          Concessioner Declaration Provided?
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                concessionerDeclarationProvided: true,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.concessionerDeclarationProvided === true,
                              false
                            )}
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                concessionerDeclarationProvided: false,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.concessionerDeclarationProvided ===
                                false,
                              false
                            )}
                          >
                            No
                          </Button>
                        </div>

                        {/* Next Step */}
                        <div className="flex justify-center">
                          <Button
                            onClick={handleNextStep}
                            className="bg-[#1951A4] hover:bg-[#164685] text-white text-[16px]"
                          >
                            Next Step
                          </Button>
                        </div>
                      </>
                    )}

                    {/* STEP 9 CONTENT */}
                    {step.id === 9 && (
                      <>
                        <p className="mb-4 text-[20px]">
                          Tell us how you&apos;d like to receive your bills and
                          updates.
                        </p>

                        {/* 1) Consent to Electronic Bills? */}
                        <p className="mb-2 text-[16px]">
                          Do you consent to receiving bills, notices, and other
                          documents related to your energy supply
                          electronically?
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                consentElectronicBills: true,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.consentElectronicBills === true,
                              false
                            )}
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                consentElectronicBills: false,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.consentElectronicBills === false,
                              false
                            )}
                          >
                            No
                          </Button>
                        </div>

                        {/* 2) All Communication Same Method? */}
                        <p className="mb-2 text-[16px]">
                          Would you prefer all communication via the same
                          method?
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                allCommunicationSameMethod: true,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.allCommunicationSameMethod === true,
                              false
                            )}
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                allCommunicationSameMethod: false,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.allCommunicationSameMethod === false,
                              false
                            )}
                          >
                            No
                          </Button>
                        </div>

                        {/* 3) Use Primary Contact Email? (only if all comm. same method is Yes) */}
                        {formData.allCommunicationSameMethod && (
                          <>
                            <p className="mb-2 text-[16px]">
                              For account‑related notices, including your
                              Welcome Pack, should we use your primary contact
                              email address?
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Button
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    usePrimaryEmailForAll: true,
                                  }))
                                }
                                className={getToggleButtonClasses(
                                  formData.usePrimaryEmailForAll === true,
                                  false
                                )}
                              >
                                Yes
                              </Button>
                              <Button
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    usePrimaryEmailForAll: false,
                                  }))
                                }
                                className={getToggleButtonClasses(
                                  formData.usePrimaryEmailForAll === false,
                                  false
                                )}
                              >
                                No
                              </Button>
                            </div>
                          </>
                        )}

                        {/* 4) Postal Address Correct? */}
                        <p className="mb-2 text-[16px]">
                          Is your postal address correct?
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                isPostalAddressCorrect: true,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.isPostalAddressCorrect === true,
                              false
                            )}
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                isPostalAddressCorrect: false,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.isPostalAddressCorrect === false,
                              false
                            )}
                          >
                            No
                          </Button>
                        </div>

                        {/* Next Step */}
                        <div className="flex justify-center">
                          <Button
                            onClick={handleNextStep}
                            className="bg-[#1951A4] hover:bg-[#164685] text-white text-[16px]"
                          >
                            Next Step
                          </Button>
                        </div>
                      </>
                    )}

                    {/* STEP 10 CONTENT */}
                    {step.id === 10 && (
                      <>
                        <p className="mb-4 text-[20px]">
                          A few final details about your billing and
                          communication preferences..
                        </p>

                        {/* 1) Monthly Bills OK? */}
                        <p className="mb-2 text-[16px]">
                          We’ll send you bills monthly, based on meter reads
                          provided by your meter data provider. Is that OK?
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                monthlyBillsOk: true,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.monthlyBillsOk === true,
                              false
                            )}
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                monthlyBillsOk: false,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.monthlyBillsOk === false,
                              false
                            )}
                          >
                            No
                          </Button>
                        </div>

                        {/* 2) Promotional Contact Consent */}
                        <p className="mb-2 text-[16px]">
                          We may contact you from time to time via phone, email,
                          SMS, or other means to promote products and offers,
                          including gas and electricity offers from our
                          associated partners. You can opt out at any time by
                          letting us know. Do you agree?
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                promotionalContactConsent: true,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.promotionalContactConsent === true,
                              false
                            )}
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                promotionalContactConsent: false,
                              }))
                            }
                            className={getToggleButtonClasses(
                              formData.promotionalContactConsent === false,
                              false
                            )}
                          >
                            No
                          </Button>
                        </div>

                        {/* Next Step */}
                        <div className="flex justify-center">
                          <Button
                            onClick={handleNextStep}
                            className="bg-[#1951A4] hover:bg-[#164685] text-white text-[16px]"
                          >
                            Next Step
                          </Button>
                        </div>
                      </>
                    )}

                    {/* STEP 11 CONTENT */}
                    {step.id === 11 && (
                      <>
                        <p className="mb-4 text-[20px]">
                          Please review the Electricity Market Offer Contract
                          Summary and EIC Script before completing your sign-up.
                        </p>

                        {/* Button: Market Offer Contract Summary */}
                        <div className="mb-4">
                          <Button
                            onClick={() => {
                              // e.g., open a modal or PDF link
                              // setFormData((prev) => ({ ...prev, hasReviewedMarketOfferSummary: true }));
                              alert("Opening Market Offer Contract Summary...");
                            }}
                            className="bg-yellow-400 hover:bg-yellow-500 text-[#1951A4] text-[16px] font-normal"
                          >
                            Electricity Market Offer Contract Summary
                          </Button>
                          <p className="mt-2 text-sm text-gray-700">
                            Sales agent provides a summary of the contract
                            terms, including rates, fees, and conditions.
                          </p>
                        </div>

                        {/* Button: EIC Script */}
                        <div className="mb-6">
                          <Button
                            onClick={() => {
                              // e.g., open a modal or PDF link
                              // setFormData((prev) => ({ ...prev, hasReviewedEICScript: true }));
                              alert("Opening EIC Script...");
                            }}
                            className="bg-yellow-400 hover:bg-yellow-500 text-[#1951A4] text-[16px] font-normal"
                          >
                            Explicit Informed Consent (EIC) Script
                          </Button>
                          <p className="mt-2 text-sm text-gray-700">
                            Sales agent reads the EIC script, confirming the
                            customer’s understanding and agreement to the
                            contract terms..
                          </p>
                        </div>

                        {/* Next Step (or final) */}
                        <div className="flex justify-center">
                          <Button
                            onClick={handleNextStep}
                            className="bg-[#1951A4] hover:bg-[#164685] text-white text-[16px]"
                          >
                            Next Step
                          </Button>
                        </div>
                      </>
                    )}

                    {/* PLACEHOLDER for STEPS 6..11 (unchanged)
              {![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(step.id) &&
                !step.isFinal && (
                  <>
                    <p className="mb-6 text-[20px]">
                      Content for <strong>{step.title}</strong> goes here.
                    </p>
                    <div className="flex justify-center">
                      <Button
                        onClick={handleNextStep}
                        className="bg-[#1951A4] hover:bg-[#164685] text-white text-[16px]"
                      >
                        Next Step
                      </Button>
                    </div>
                  </>
                )} */}

                    {/* Final Step */}
                    {step.isFinal && (
                      <>
                        {/* Sub-heading or instructions */}
                        <p className="mb-3 text-[20px]">
                          Review all your details and confirm they are correct.
                        </p>

                        {/* Confirm & Submit Button */}
                        <div className="flex mb-4">
                          <Button
                            onClick={() => alert("Submitting...")}
                            className="bg-[#1951A4] hover:bg-[#164685] text-white text-[16px]"
                          >
                            Confirm &amp; Submit
                          </Button>
                        </div>

                        {/* Completion note */}
                        <p className="text-[16px] text-gray-700">
                          That&apos;s it! Your sign-up is complete. You&apos;ll
                          receive a confirmation shortly. If you have any
                          questions, feel free to contact us.
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
