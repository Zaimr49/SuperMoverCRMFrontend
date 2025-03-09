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
        "px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 " +
          "focus:ring-offset-2 transition-colors text-[20px]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default function SignUpForm() {
  const [steps, setSteps] = useState([
    { id: 1, title: "Sale Type", isOpen: false },
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

  const [formData, setFormData] = useState({
    connectionType: "", // "moveIn" or "transfer"
    products: [], // e.g. ["electricity","gas","broadband"]
    customerType: "", // "residential" or "business"
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

  // Single-select for connection type
  const handleConnectionTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, connectionType: type }));
  };

  // Multi-select for products
  const handleProductSelect = (product) => {
    setFormData((prev) => {
      const products = prev.products.includes(product)
        ? prev.products.filter((p) => p !== product)
        : [...prev.products, product];
      return { ...prev, products };
    });
  };

  // Single-select for customer type
  const handleCustomerTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, customerType: type }));
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

  const getToggleButtonClasses = (isSelected, isDisabled) => {
    if (isDisabled) {
      return "bg-red-400 text-white cursor-not-allowed text-[16px] font-normal";
    }
    return isSelected
      ? "bg-blue-600 hover:bg-blue-700 text-white text-[16px] font-normal"
      : "bg-yellow-400 hover:bg-yellow-500 text-blue-500 text-[16px] font-normal";
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
              {/* “Step #num” in blue, colon + title in default color */}
              <span className="text-blue-600">
                {step.isFinal ? "Final Step" : `Step ${step.id}`}
              </span>
              : {step.title}
            </h2>
            {/* <ChevronDown
              className={cn(
                "h-5 w-5 transition-transform duration-200 text-black",
                step.isOpen ? "transform rotate-180" : ""
              )}
            /> */}
            <ChevronDown
                className={cn(
                    "h-8 w-8 transition-transform duration-200 text-blue-600",
                    step.isOpen ? "transform rotate-180" : ""
                )}
                />

          </button>

          {/* The thinner yellow divider */}
          {/* <div className="h-px bg-yellow-400 mt-2 mb-4" /> */}
          <div className="border-t border-yellow-400 mt-2 mb-4" />

          {step.isOpen && (
            <div className="pl-2">
              {/* Step 1 content */}
              {step.id === 1 ? (
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
                          true
                        )}
                      >
                        Water
                      </Button>
                      <Button
                        onClick={() => handleProductSelect("broadband")}
                        className={getToggleButtonClasses(
                          formData.products.includes("broadband"),
                          true
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
                      className="bg-blue-600 hover:bg-blue-700 text-[16px] text-white"
                    >
                      Next Step
                    </Button>
                  </div>
                </>
              ) : (
                // Placeholder content for steps 2..11 and Final Step
                <>
                  <p className="mb-6 text-[20px]">
                    Content for <strong>{step.title}</strong> goes here.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      onClick={handleNextStep}
                      className="bg-blue-600 text-[16px]  hover:bg-blue-700 text-white"
                    >
                      {step.isFinal ? "Submit" : "Next Step"}
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
