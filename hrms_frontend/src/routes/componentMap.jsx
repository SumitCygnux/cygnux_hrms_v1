// C:\Users\bbbb\Documents\GitHub\cygnux_hrms_v1\hrms_frontend\src\routes\componentMap.jsx

// ૧. Admin / Core Pages Imports
import Dashboard from "../pages/admin/Dashboard/Dashboard";
import EmployeeList from "../pages/admin/Employees/EmployeeList";
import EmployeeProfile from "../pages/admin/Employees/EmployeeProfile";
import Addemployee from "../pages/admin/Employees/Addemployee";
import Attendance from "../pages/admin/Attendance/Attendance";
import Leave from "../pages/admin/Leave/Leave";
import Payroll from "../pages/admin/Payroll/Payroll";
import Performance from "../pages/admin/Performance/Performance";
import Recruitment from "../pages/admin/Recruitment/Recruitment";
import Departments from "../pages/admin/Departments/Departments";
import Designations from "../pages/admin/Designations/Designations";
import Reports from "../pages/admin/Reports/Reports";
import Profileadmin from "../pages/admin/profile/Profileadmin";
import Calendar from "../pages/admin/Calendar/Calendar";
import Settings from "../pages/admin/Settings/Settings";

// ૨. Staff Portal Pages Imports
import StaffDashboard from "../pages/staff/Dashboard/StaffDashboard";
import StaffAttendance from "../pages/staff/Attendance/StaffAttendance";
import StaffLeave from "../pages/staff/Leave/StaffLeave";
import StaffPayroll from "../pages/staff/Payroll/StaffPayroll";
import StaffPerformance from "../pages/staff/Performance/StaffPerformance";
import StaffProfile from "../pages/staff/Profile/StaffProfile";
import StaffCalendar from "../pages/staff/Calendar/StaffCalendar";

// ૩. Dedicated Dashboards Imports
import Hrdashboard from "../pages/HR/Hrdashboard";
import Managerdashboard from "../pages/manager/Managerdashboard";

// 🌟 MASTER COMPONENT MAP 🌟
// આ ઓબ્જેક્ટ બેકએન્ડના 'identifier' (સ્ટ્રિંગ) ને રીએક્ટ કમ્પોનન્ટ સાથે જોડે છે
export const componentMap = {
  // --- Admin / Core Module Identifiers ---
  "dashboard": <Dashboard />,
  "employees": <EmployeeList />,
  "add_employee": <Addemployee />,
  "employee_profile": <EmployeeProfile />,
  "attendance": <Attendance />,
  "leave": <Leave />,
  "payroll": <Payroll />,
  "performance": <Performance />,
  "recruitment": <Recruitment />,
  "departments": <Departments />,
  "designations": <Designations />,
  "reports": <Reports />,
  "profile": <Profileadmin />,
  "calendar": <Calendar />,
  "settings": <Settings />,

  // --- Staff Module Identifiers ---
  "staff_dashboard": <StaffDashboard />,
  "staff_attendance": <StaffAttendance />,
  "staff_leave": <StaffLeave />,
  "staff_payroll": <StaffPayroll />,
  "staff_performance": <StaffPerformance />,
  "staff_profile": <StaffProfile />,
  "staff_calendar": <StaffCalendar />,

  // --- Role Specific Dashboard Identifiers ---
  "hr_dashboard": <Hrdashboard />,
  "manager_dashboard": <Managerdashboard />,
};
