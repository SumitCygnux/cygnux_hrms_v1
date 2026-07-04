import {
  MdDashboard,
  MdPeople,
  MdAccessTime,
  MdEventBusy,
  MdPayments,
  MdStarBorder,
  MdWorkOutline,
  MdBusiness,
  MdBadge,
  MdAssessment,
  MdCalendarToday,
  MdSettings,
} from "react-icons/md";

export const sidebarMenu = [

  {
    title: "Dashboard",
    module: "dashboard",
    path: "/dashboard",
    icon: MdDashboard,
  },

  {
    title: "Employees",
    module: "staff",
    path: "/employees",
    icon: MdPeople,
  },

  {
    title: "Attendance",
    module: "attendance",
    path: "/attendance",
    icon: MdAccessTime,
  },

  {
    title: "Leave",
    module: "leave",
    path: "/leave",
    icon: MdEventBusy,
  },

  {
    title: "Payroll",
    module: "payroll",
    path: "/payroll",
    icon: MdPayments,
  },

  {
    title: "Performance",
    module: "performance",
    path: "/performance",
    icon: MdStarBorder,
  },

  {
    title: "Recruitment",
    module: "recruitment",
    path: "/recruitment",
    icon: MdWorkOutline,
  },

  {
    title: "Departments",
    module: "department",
    path: "/departments",
    icon: MdBusiness,
  },

  {
    title: "Designations",
    module: "designation",
    path: "/designations",
    icon: MdBadge,
  },

  {
    title: "Reports",
    module: "reports",
    path: "/reports",
    icon: MdAccessTime  ,
  },

  {
    title: "Calendar",
    module: "calendar",
    path: "/calendar",
    icon: MdCalendarToday,
  },

  {
    title: "Settings",
    module: "settings",
    path: "/settings",
    icon: MdSettings,
  }
];