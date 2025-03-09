import { useState } from "react";
import { ChevronDown } from "lucide-react";
import classNames from "classnames";

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
        "w-36 px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 " +
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

  const [currentStep, setCurrentStep] = useState(1);

  // Include fields in formData for Steps 2 & 3
  const [formData, setFormData] = useState({
    // Step 1 fields:
    connectionType: "", // "moveIn" or "transfer"
    products: [],       // e.g. ["electricity","gas","broadband"]
    customerType: "",   // "residential" or "business"

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
    isOwner: null,   // true or false
    hasSolar: null,  // true or false

    // Step 4 fields:
    dob: "",
    verificationMethod: "",  // e.g. "Driver's License", "Passport", "Medicare"
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
  const handleNextStep = () => {
    const nextStepId = currentStep + 1;
    const nextStep = steps.find((step) => step.id === nextStepId);
    if (nextStep) {
      setSteps((prevSteps) =>
        prevSteps.map((step) => ({
          ...step,
          isOpen: step.id === nextStepId,
        }))
      );
      setCurrentStep(nextStepId);
    }
  };

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

  return (
    <div className="max-w-6xl mx-auto px-2 py-6 bg-white text-left text-gray-800">
      {steps.map((step) => (
        <div key={step.id} className="mb-6">
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
                        onClick={() => handleConnectionTypeSelect("moveIn")}
                        className={getToggleButtonClasses(
                          formData.connectionType === "moveIn",
                          false
                        )}
                      >
                        Move In
                      </Button>
                      <Button
                        onClick={() => handleConnectionTypeSelect("transfer")}
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
                    <p className="font-normal mb-2">Are you signing up as a:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => handleCustomerTypeSelect("residential")}
                        className={getToggleButtonClasses(
                          formData.customerType === "residential",
                          false
                        )}
                      >
                        Residential Customer
                      </Button>
                      <Button
                        onClick={() => handleCustomerTypeSelect("business")}
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
                      {["Mr", "Mrs", "Ms", "Miss", "Dr", "Mx"].map((t) => (
                        <Button
                          key={t}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, title: t }))
                          }
                          className={getToggleButtonClasses(
                            formData.title === t,
                            false
                          )}
                        >
                          {t}
                        </Button>
                      ))}
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
                      Is your billing address the same as your physical address?
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
                          setFormData((prev) => ({ ...prev, isOwner: true }))
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
                          setFormData((prev) => ({ ...prev, isOwner: false }))
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
                          setFormData((prev) => ({ ...prev, hasSolar: true }))
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
                          setFormData((prev) => ({ ...prev, hasSolar: false }))
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
                          {["Mr", "Mrs", "Ms", "Miss", "Dr", "Mx"].map((t) => (
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
                          ))}
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

              {/* PLACEHOLDER for STEPS 6..11 (unchanged) */}
              {![1, 2, 3, 4, 5].includes(step.id) && !step.isFinal && (
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
              )}

              {/* Final Step Placeholder */}
              {step.isFinal && (
                <>
                  <p className="mb-6 text-[20px]">
                    Review everything and submit your form.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      onClick={() => alert("Submitting...")}
                      className="bg-[#1951A4] hover:bg-[#164685] text-white text-[16px]"
                    >
                      Submit
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
