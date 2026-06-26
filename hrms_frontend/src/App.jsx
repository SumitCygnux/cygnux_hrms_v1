import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { HRMSDataProvider } from "./context/HRMSDataContext";


import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SetupPassword from "./pages/auth/SetupPassword";


// Admin Layout
import DashboardLayout from "./components/layouts/DashboardLayout";


// Staff Layout
import StaffDashboardLayout from "./components/layouts/StaffDashboardLayout";


// Admin Pages
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


// Staff Pages
import StaffDashboard from "./pages/staff/Dashboard/StaffDashboard";
import StaffAttendance from "./pages/staff/Attendance/StaffAttendance";
import StaffLeave from "./pages/staff/Leave/StaffLeave";
import StaffPayroll from "./pages/staff/Payroll/StaffPayroll";
import StaffPerformance from "./pages/staff/Performance/StaffPerformance";
import StaffProfile from "./pages/staff/Profile/StaffProfile";
import StaffCalendar from "./pages/staff/Calendar/StaffCalendar";


import "react-toastify/dist/ReactToastify.css";


function AdminRoute() {
  const isAuthenticated = !!localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isStaff = storedUser?.role === "EMPLOYEE" || storedUser?.isStaff === true;


  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isStaff) return <Navigate to="/staff/dashboard" replace />;
  return <DashboardLayout />;
}

function StaffRoute() {
  const isAuthenticated = !!localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isStaff = storedUser?.role === "EMPLOYEE" || storedUser?.isStaff === true;


  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isStaff) return <Navigate to="/dashboard" replace />;
  return <StaffDashboardLayout />;
}

function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isStaff = storedUser?.role === "EMPLOYEE" || storedUser?.isStaff === true;

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
              <Navigate to={isStaff ? "/staff/dashboard" : "/dashboard"} replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to={isStaff ? "/staff/dashboard" : "/dashboard"} replace />
            ) : (
              <Register />
            )
          }
        />

        <Route path="/setup-password" element={<SetupPassword />} />

        {/* Admin Protected Routes — admin only, staff gets redirected to /staff/dashboard */}
        <Route element={<AdminRoute />}>
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

        {/* Staff Portal Routes — staff only, admin gets redirected to /dashboard */}
        <Route element={<StaffRoute />}>
          <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/attendance" element={<StaffAttendance />} />
          <Route path="/staff/leave" element={<StaffLeave />} />
          <Route path="/staff/payroll" element={<StaffPayroll />} />
          <Route path="/staff/performance" element={<StaffPerformance />} />
          <Route path="/staff/profile" element={<StaffProfile />} />
          <Route path="/staff/calendar" element={<StaffCalendar />} />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? (isStaff ? "/staff/dashboard" : "/dashboard") : "/login"}
              replace
            />

            <Route path="/setup-password" element={<SetupPassword />} />

            {/* Admin Protected Routes — admin only, staff gets redirected to /staff/dashboard */}
            <Route element={<AdminRoute />}>
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

            {/* Staff Portal Routes — staff only, admin gets redirected to /dashboard */}
            <Route element={<StaffRoute />}>
              <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/staff/attendance" element={<StaffAttendance />} />
              <Route path="/staff/leave" element={<StaffLeave />} />
              <Route path="/staff/payroll" element={<StaffPayroll />} />
              <Route path="/staff/performance" element={<StaffPerformance />} />
              <Route path="/staff/profile" element={<StaffProfile />} />
              <Route path="/staff/calendar" element={<StaffCalendar />} />
            </Route>
           

            {/* Fallback */}
            <Route
              path="*"
              element={
                <Navigate
                  to={isAuthenticated ? (isStaff ? "/staff/dashboard" : "/dashboard") : "/login"}
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