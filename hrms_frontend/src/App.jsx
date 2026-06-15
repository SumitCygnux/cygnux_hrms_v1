import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { HRMSDataProvider } from "./context/HRMSDataContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";

// Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import EmployeeList from "./pages/Employees/EmployeeList";
import EmployeeProfile from "./pages/Employees/EmployeeProfile";
import Attendance from "./pages/Attendance/Attendance";
import Leave from "./pages/Leave/Leave";
import Payroll from "./pages/Payroll/Payroll";
import Performance from "./pages/Performance/Performance";
import Recruitment from "./pages/Recruitment/Recruitment";
import Departments from "./pages/Departments/Departments";
import Designations from "./pages/Designations/Designations";
import Reports from "./pages/Reports/Reports";
import Calendar from "./pages/Calendar/Calendar";
import Settings from "./pages/Settings/Settings";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider>
      <HRMSDataProvider>
        <BrowserRouter>
          <Routes>
            {/* Standalone Auth Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Authenticated Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/employees/:id" element={<EmployeeProfile />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/leave" element={<Leave />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/designations" element={<Designations />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </HRMSDataProvider>
    </ThemeProvider>
  );
}

export default App;
