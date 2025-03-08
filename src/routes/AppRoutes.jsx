import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
// import Dashboard from "../pages/Dashboard";
import LeadCaptureForm from "../pages/LeadCaptureForm/LeadCaptureForm"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/lead-capture-form" element={<LeadCaptureForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
