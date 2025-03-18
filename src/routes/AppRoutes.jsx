import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AuthContext from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import LeadCaptureForm from "../pages/LeadCaptureForm/LeadCaptureForm";
import SignUpForm from "../pages/SignUpForm";
import SalesReportingDashboard from "../pages/SalesReportingDashboard";
import UserAccessSettings from "../pages/UserAccessSettings";
import CreateAgentRoleProfile from "../pages/CreateAgentRoleProfile";
import EditAgentRoleProfile from "../pages/EditAgentRoleProfile";

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={
            isAuthenticated() ? <Navigate to="/dashboard" /> : <Signup />
          }
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/sales-dashboard"
          element={<ProtectedRoute element={<SalesReportingDashboard />} />}
        />
        <Route
          path="/user-access-settings"
          element={<ProtectedRoute element={<UserAccessSettings />} />}
        />
        <Route
          path="/create-agent-profile"
          element={<ProtectedRoute element={<CreateAgentRoleProfile />} />}
        />
        <Route
          path="/edit-agent-profile"
          element={<ProtectedRoute element={<EditAgentRoleProfile />} />}
        />

        <Route
          path="/lead-capture-form"
          element={<ProtectedRoute element={<LeadCaptureForm />} />}
        />
        <Route
          path="/signup-form"
          element={<ProtectedRoute element={<SignUpForm />} />}
        />

        {/* <Route path="/lead-capture-form" element={<LeadCaptureForm />} />
        <Route path="/signup-form" element={<SignUpForm />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
