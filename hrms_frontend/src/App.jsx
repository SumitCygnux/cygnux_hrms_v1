import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { HRMSDataProvider } from "./context/HRMSDataContext";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SetupPassword from "./pages/auth/SetupPassword";

import DashboardLayout from "./components/layouts/DashboardLayout";

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
import EmployeeLeave from "./pages/admin/Leave/EmployeeLeave";
import TeamLeave from "./pages/admin/Leave/TeamLeave";

import StaffDashboard from "./pages/staff/Dashboard/StaffDashboard";
import StaffAttendance from "./pages/staff/Attendance/StaffAttendance";
import StaffLeave from "./pages/staff/Leave/StaffLeave";
import StaffPayroll from "./pages/staff/Payroll/StaffPayroll";
import StaffPerformance from "./pages/staff/Performance/StaffPerformance";
import StaffProfile from "./pages/staff/Profile/StaffProfile";
import StaffCalendar from "./pages/staff/Calendar/StaffCalendar";

import "react-toastify/dist/ReactToastify.css";
import Addemployee from "./pages/admin/Employees/Addemployee";

import Hrdashboard from "./pages/HR/Hrdashboard";
import Managerdashboard from "./pages/manager/Managerdashboard";
import Profileadmin from "./pages/admin/profile/Profileadmin";

function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <DashboardLayout />;
}
function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const role = storedUser?.role || "";

  return (
    <AuthProvider>
      <ThemeProvider>
        <HRMSDataProvider>
          <BrowserRouter>
            <Routes>
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
                    <Navigate to="/staff/dashboard" replace />
                  ) : (
                    <Register />
                  )
                }
              />
              <Route path="/setup-password" element={<SetupPassword />} />

              <Route element={<ProtectedRoute />}>
                {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}

                {/* <Route
                  path="/dashboard"
                  element={
                    role === "EMPLOYEE" ? (
                      <StaffDashboard />
                    ) : role === "HR" ? (
                      <Hrdashboard />
                    ) : role === "MANAGER" ? (
                      <Managerdashboard />
                    ) : role === "ADMIN" ? (
                      <Dashboard />
                    ) : (
                      <Dashboard />
                    )
                  }
                /> */}

                <Route
                  path="/dashboard"
                  element={
                    role === "SUPER_ADMIN" ? (
                      <Dashboard />
                    ) : role === "TENANT_ADMIN" ? (
                      <Dashboard />
                    ) : role === "HR" ? (
                      <Hrdashboard />
                    ) : role === "MANAGER" ? (
                      <Managerdashboard />
                    ) : role === "EMPLOYEE" ? (
                      <StaffDashboard />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route path="/hr/dashboard" element={<Hrdashboard />} />
                <Route
                  path="/manager/dashboard"
                  element={<Managerdashboard />}
                />
                <Route path="/staff/dashboard" element={<StaffDashboard />} />
                <Route path="/employees" element={<EmployeeList />} />
                <Route path="/addemployee" element={<Addemployee />} />
                <Route path="/employees/:id" element={<EmployeeProfile />} />
                <Route path="/updateemployee/:id" element={<Addemployee />} />

                <Route
                  path="/attendance"
                  element={
                    role === "EMPLOYEE" ? <StaffAttendance /> : <Attendance />
                  }
                />
                {/* <Route 
                  path="/leave" 
                  element={role === "EMPLOYEE" ? <StaffLeave /> : <Leave />} 
                /> */}
                <Route path="/leave" element={<Leave />} />
                <Route
                  path="/leave/employee-leave"
                  element={<EmployeeLeave />}
                />

                <Route path="/leave/team-leave" element={<EmployeeLeave />} />
                {/* <Route path="/leave/approval" element={<LeaveApproval />} /> */}
                <Route
                  path="/payroll"
                  element={role === "EMPLOYEE" ? <StaffPayroll /> : <Payroll />}
                />
                <Route
                  path="/performance"
                  element={
                    role === "EMPLOYEE" ? <StaffPerformance /> : <Performance />
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    role === "EMPLOYEE" ? <StaffCalendar /> : <Calendar />
                  }
                />
                <Route
                  path="/profile"
                  element={
                    role === "EMPLOYEE" ? <StaffProfile /> : <Profileadmin />
                  }
                />

                <Route path="/recruitment" element={<Recruitment />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/designations" element={<Designations />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

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
    </AuthProvider>
  );
}

export default App;
