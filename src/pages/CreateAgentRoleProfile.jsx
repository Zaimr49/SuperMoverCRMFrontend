import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaSignOutAlt } from "react-icons/fa";
import person from "../assets/person.jpg";

import Sidebar from "../components/Sidebar"; // Adjust import path to your Sidebar component
import "../styles/Dashboard.css"; // Adjust if you have a specific CSS file

const CreateAgentRoleProfile = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    phone: "",
    email: "",
    position: "",
    category: "",
  });

  // State to hold uploaded photo (optional)
  const [photo, setPhoto] = useState(null);

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  // Dummy logout function
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form validation or API calls here
    console.log("Form Data:", formData);
    console.log("Uploaded Photo:", photo);
    alert("Form submitted!");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar className="w-1/4 h-screen fixed md:relative" />

      {/* Main Content */}
      <main className="flex-1 p-6 ml-1/4 overflow-y-auto h-screen">
        {/* Header */}
        <header className="grid grid-cols-3 items-center mb-4">
          {/* Left Column: Greeting */}
          <div className="text-left">
            <h1 className="text-2xl font-semibold">Hello Orson 👋,</h1>
          </div>

          {/* Center Column: Page Title */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">
              Create Agent Role &amp; Profile
            </h1>
          </div>

          {/* Right Column: Search Bar and Logout Button */}
          <div className="flex items-center justify-end space-x-1">
            <div className="relative w-64">
              <FiSearch className="absolute top-2 left-2 text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-3 py-2 border rounded-md w-full"
              />
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              <FaSignOutAlt className="text-xl" />
            </button>
          </div>
        </header>

        {/* Content Section */}
        <section className="bg-white rounded-md shadow p-14">
          {/* Agent Info */}
          <div className="flex items-center text-[#1E3A5F] text-lg py-5 font-medium space-x-2">
            <span>Agent ID</span>
            <span>·</span>
            <span>Green Realty</span>
            <span>·</span>
            <span>Agency ID 27392</span>
          </div>

          {/* Horizontal line */}
          <hr className="mb-4 border-gray-300" />

          {/* Role & Profile Details */}
          <h1 className="text-[26px] text-left mb-4">
            Role &amp; Profile Details
          </h1>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-3 gap-6 items-start"
          >
            {/* Profile Photo Section */}
            <div className="flex flex-col items-start space-y-3">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-48 h-48 rounded-full shadow-lg overflow-hidden p-5">
                  <img
                    src={photo ? URL.createObjectURL(photo) : person}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className="text-xs text-gray-500">
                  Minimum Size 800*800 px
                </span>
                <button
                  type="button"
                  onClick={() => document.getElementById("photoUpload").click()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm "
                >
                  Change Photo
                </button>
                <input
                  id="photoUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            {/* Input Fields Section */}
            <div className="col-span-2 grid grid-cols-3 gap-x-4 gap-y-10">
              {/* First Name */}
              <div className="text-left">
                <label
                  className="block mb-1 font-medium text-sm"
                  htmlFor="firstName"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="text-left">
                <label
                  className="block mb-1 font-medium text-sm"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>

              {/* Mobile */}
              <div className="text-left">
                <label
                  className="block mb-1 font-medium text-sm"
                  htmlFor="mobile"
                >
                  Mobile
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="text"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Phone */}
              <div className="text-left">
                <label
                  className="block mb-1 font-medium text-sm"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Email */}
              <div className="text-left">
                <label
                  className="block mb-1 font-medium text-sm"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>

              {/* Empty Space for Alignment */}
              <div></div>

              {/* Position (Dropdown) */}
              <div className="text-left">
                <label
                  className="block mb-1 font-medium text-sm"
                  htmlFor="position"
                >
                  Position
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-white"
                >
                  <option value="">Select a position</option>
                  <option value="Lead Manager">Lead Manager</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Sales & Lead Team">Sales & Lead Team</option>
                  <option value="Finance Manager">Finance Manager</option>
                  <option value="Operations Manager">Operations Manager</option>
                </select>
              </div>

              {/* Category */}
              <div className="text-left">
                <label
                  className="block mb-1 font-medium text-sm"
                  htmlFor="category"
                >
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            {/* Submit Button (Right-Aligned & Blue) */}
            <div className="col-span-3 flex justify-end mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Save Profile
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CreateAgentRoleProfile;
