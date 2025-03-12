import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AuthContext from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import LeadCaptureForm from "../pages/LeadCaptureForm"
import SignUpForm from "../pages/SignUpForm"


const AppRoutes = () => {

  const { isAuthenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        
        <Route path="/lead-capture-form" element={<ProtectedRoute element={<LeadCaptureForm />} />} />
        <Route path="/signup-form" element={<ProtectedRoute element={<SignUpForm />} />} />
        
        {/* <Route path="/lead-capture-form" element={<LeadCaptureForm />} />
        <Route path="/signup-form" element={<SignUpForm />} /> */}


      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
