import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import config from "../config"; // Import base URL
import api from "../api";
import loginSuperMoverLogo from "../assets/logo-1.png";


const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // for signup
  const [isLogin, setIsLogin] = useState(true); // toggle between login and signup
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? "/core/login/" : "/core/signup/";
      const payload = isLogin ? { email, password } : { email, password, name };
      const { data } = await api.post(url, payload);
      login(data.access, data.refresh);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login/Signup failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-black text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-4xl flex items-left absolute top-10 left-10">
          <img src={loginSuperMoverLogo} alt="Super Mover Logo" className="h-[68px] w-auto" />
        </h1>
        <div className="flex flex-col justify-center items-center flex-grow">
          <p className="text-4xl mt-4 text-left font-sans">Powering Your Move,</p>
          <p className="text-4xl mt-4 text-left font-sans">Simplifying Your Connections</p>
        </div>
        <footer className="absolute bottom-4 text-gray-500 text-sm font-sans">
          © 2025 Okta, Inc. All Rights Reserved.
        </footer>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        {/* LOGIN/SIGNUP FORM */}
        <form onSubmit={handleSubmit}>
          {/* <div className="bg-white p-10 rounded-lg shadow-lg w-96 "> */}
          <div className="bg-white p-10 rounded-lg shadow-lg w-[35rem] h-[38rem] flex flex-col justify-center">
            <h2 className="text-2xl mb-6 text-center">{isLogin ? "LOGIN" : "SIGN UP"}</h2>

            {/* Name Input (Only for Signup) */}
            {!isLogin && (
              <div className="mb-4 text-left">
                <label className="block text-gray-700 text-sm mb-2 font-sans">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            {/* Email Input */}
            <div className="mb-4 text-left">
              <label className="block text-gray-700 text-sm mb-2 font-sans">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="mb-4 text-left">
              <label className="block text-gray-700 text-sm mb-2 font-sans">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Forgot Password Link */}
            {isLogin && (
              <div className="text-right text-sm text-blue-600 mb-4 font-sans">
                <Link to="/forgot-password">Forgot your Password?</Link>
              </div>
            )}

            {/* Submit Button */}
            <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-sans">
              {isLogin ? "Continue" : "Sign Up"}
            </button>

            {/* Terms & Conditions */}
            {!isLogin && (
              <p className="text-xs text-gray-500 text-center mt-4 font-sans">
                By continuing, you agree to the{" "}
                <span className="text-blue-600">Self Service PSS</span> and{" "}
                <span className="text-blue-600">Privacy Policy</span>.
              </p>
            )}

            {/* Switch between Login/SignUp */}
            <p className="text-center mt-6 font-sans">
              {isLogin ? (
                <>
                  Or <Link to="#" className="text-blue-600" onClick={() => setIsLogin(false)}>Sign up</Link>
                </>
              ) : (
                <>
                  Already have an account? <Link to="#" className="text-blue-600" onClick={() => setIsLogin(true)}>Login</Link>
                </>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
