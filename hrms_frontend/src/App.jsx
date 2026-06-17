import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { HRMSDataProvider } from "./context/HRMSDataContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Layout
import DashboardLayout from "./components/layouts/DashboardLayout";

// Pages
// Pages
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import EmployeeList from "./pages/admin/Employees/EmployeeList";
import EmployeeProfile from "./pages/admin/Employees/EmployeeProfile";
import Attendance from "./pages/admin/Attendance/Attendance";
import Leave from "./pages/admin/Leave/Leave";
import Payroll from "./pages/admin/Payroll/Payroll";
import Performance from "./pages/admin/Performance/Performance";
import Recruitment from "./pages/admin/Recruitment/Recruitment";
import Departments from "./pages/admin/Departments/Departments";
import Designations from "./pages/admin/Designations/Designations";
import Reports from "./pages/admin/Reports/Reports";
import Calendar from "./pages/admin/Calendar/Calendar";
import Settings from "./pages/admin/Settings/Settings";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <ThemeProvider>
      <HRMSDataProvider>
        <BrowserRouter>
          <Routes>

            {/* Public Routes */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login />
                )
              }
            />

            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Register />
                )
              }
            />

            {/* Protected Routes */}
            <Route
              element={
                isAuthenticated ? (
                  <DashboardLayout />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />

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

            {/* Fallback */}
            <Route
              path="*"
              element={
                <Navigate
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  replace
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </HRMSDataProvider>
    </ThemeProvider>
  );
}

export default App;