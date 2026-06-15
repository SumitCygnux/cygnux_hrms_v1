export const initialDepartments = [
  { id: "DEPT-001", name: "Engineering", manager: "Sarah Connor", headcount: 45, budget: 1500000, openPositions: 4 },
  { id: "DEPT-002", name: "Human Resources", manager: "Emma Watson", headcount: 8, budget: 350000, openPositions: 1 },
  { id: "DEPT-003", name: "Sales & Marketing", manager: "James Bond", headcount: 22, budget: 800000, openPositions: 3 },
  { id: "DEPT-004", name: "Finance", manager: "Tony Stark", headcount: 6, budget: 450000, openPositions: 1 },
  { id: "DEPT-005", name: "Product & Design", manager: "Bruce Wayne", headcount: 14, budget: 600000, openPositions: 2 },
  { id: "DEPT-006", name: "Customer Success", manager: "Diana Prince", headcount: 18, budget: 400000, openPositions: 2 }
];

export const initialDesignations = [
  { id: "DESG-001", name: "Senior Software Engineer", department: "Engineering", grade: "L3", baseSalary: 120000 },
  { id: "DESG-002", name: "Software Engineer", department: "Engineering", grade: "L2", baseSalary: 85000 },
  { id: "DESG-003", name: "HR Manager", department: "Human Resources", grade: "L3", baseSalary: 95000 },
  { id: "DESG-004", name: "Lead Product Designer", department: "Product & Design", grade: "L4", baseSalary: 140000 },
  { id: "DESG-005", name: "Sales Director", department: "Sales & Marketing", grade: "L4", baseSalary: 130000 },
  { id: "DESG-006", name: "Financial Analyst", department: "Finance", grade: "L2", baseSalary: 90000 },
  { id: "DESG-007", name: "Support Specialist", department: "Customer Success", grade: "L1", baseSalary: 55000 }
];

export const initialEmployees = [
  {
    id: "EMP-2024-001",
    name: "Alex Johnson",
    email: "alex.j@enterprise-hrms.com",
    phone: "+1 (555) 019-2834",
    department: "Engineering",
    designation: "Senior Software Engineer",
    joiningDate: "2024-03-12",
    status: "Active",
    role: "Admin",
    avatarColor: "#2563EB",
    gender: "Male",
    dateOfBirth: "1990-08-24",
    address: "742 Evergreen Terrace, Springfield, OR",
    emergencyContact: {
      name: "Helen Johnson",
      relationship: "Spouse",
      phone: "+1 (555) 019-2835"
    },
    payroll: {
      basic: 9500,
      allowances: 1500,
      deductions: 800,
      tax: 1200,
      net: 9000,
      status: "Processed"
    },
    leaveBalance: {
      sick: 8,
      casual: 12,
      paid: 20,
      sickUsed: 2,
      casualUsed: 4,
      paidUsed: 5
    },
    performance: {
      kpiScore: 92,
      rating: 4.8,
      activeReviews: 1,
      completedReviews: 4,
      reviewStatus: "Completed"
    }
  },
  {
    id: "EMP-2024-002",
    name: "Emma Watson",
    email: "emma.w@enterprise-hrms.com",
    phone: "+1 (555) 022-9844",
    department: "Human Resources",
    designation: "HR Manager",
    joiningDate: "2024-01-15",
    status: "Active",
    role: "HR Manager",
    avatarColor: "#22C55E",
    gender: "Female",
    dateOfBirth: "1992-04-15",
    address: "12 Rosewood Lane, Boston, MA",
    emergencyContact: {
      name: "Richard Watson",
      relationship: "Father",
      phone: "+1 (555) 022-9845"
    },
    payroll: {
      basic: 7800,
      allowances: 1200,
      deductions: 600,
      tax: 900,
      net: 7500,
      status: "Processed"
    },
    leaveBalance: {
      sick: 10,
      casual: 10,
      paid: 22,
      sickUsed: 1,
      casualUsed: 3,
      paidUsed: 7
    },
    performance: {
      kpiScore: 88,
      rating: 4.5,
      activeReviews: 0,
      completedReviews: 3,
      reviewStatus: "Completed"
    }
  },
  {
    id: "EMP-2024-003",
    name: "Bruce Wayne",
    email: "bruce.w@enterprise-hrms.com",
    phone: "+1 (555) 100-3490",
    department: "Product & Design",
    designation: "Lead Product Designer",
    joiningDate: "2024-06-01",
    status: "Active",
    role: "Employee",
    avatarColor: "#0F172A",
    gender: "Male",
    dateOfBirth: "1988-10-27",
    address: "1007 Mountain Drive, Gotham City, NJ",
    emergencyContact: {
      name: "Alfred Pennyworth",
      relationship: "Guardian",
      phone: "+1 (555) 100-3499"
    },
    payroll: {
      basic: 11000,
      allowances: 2000,
      deductions: 1000,
      tax: 1500,
      net: 10500,
      status: "Processed"
    },
    leaveBalance: {
      sick: 12,
      casual: 12,
      paid: 24,
      sickUsed: 4,
      casualUsed: 2,
      paidUsed: 8
    },
    performance: {
      kpiScore: 95,
      rating: 4.9,
      activeReviews: 1,
      completedReviews: 5,
      reviewStatus: "Completed"
    }
  },
  {
    id: "EMP-2024-004",
    name: "Sarah Connor",
    email: "sarah.c@enterprise-hrms.com",
    phone: "+1 (555) 234-5678",
    department: "Engineering",
    designation: "Senior Software Engineer",
    joiningDate: "2024-02-10",
    status: "On Leave",
    role: "Employee",
    avatarColor: "#EF4444",
    gender: "Female",
    dateOfBirth: "1985-05-13",
    address: "42 Desert Highway, Los Angeles, CA",
    emergencyContact: {
      name: "John Connor",
      relationship: "Son",
      phone: "+1 (555) 234-5679"
    },
    payroll: {
      basic: 9600,
      allowances: 1400,
      deductions: 700,
      tax: 1100,
      net: 9200,
      status: "Pending"
    },
    leaveBalance: {
      sick: 8,
      casual: 10,
      paid: 18,
      sickUsed: 6,
      casualUsed: 5,
      paidUsed: 12
    },
    performance: {
      kpiScore: 91,
      rating: 4.6,
      activeReviews: 1,
      completedReviews: 6,
      reviewStatus: "Pending Reviews"
    }
  },
  {
    id: "EMP-2024-005",
    name: "Tony Stark",
    email: "tony.s@enterprise-hrms.com",
    phone: "+1 (555) 300-4000",
    department: "Finance",
    designation: "Financial Analyst",
    joiningDate: "2024-05-18",
    status: "Active",
    role: "Admin",
    avatarColor: "#F59E0B",
    gender: "Male",
    dateOfBirth: "1980-05-29",
    address: "10880 Malibu Point, Malibu, CA",
    emergencyContact: {
      name: "Pepper Potts",
      relationship: "Spouse",
      phone: "+1 (555) 300-4001"
    },
    payroll: {
      basic: 7500,
      allowances: 1000,
      deductions: 500,
      tax: 800,
      net: 7200,
      status: "Processed"
    },
    leaveBalance: {
      sick: 10,
      casual: 12,
      paid: 20,
      sickUsed: 0,
      casualUsed: 2,
      paidUsed: 4
    },
    performance: {
      kpiScore: 84,
      rating: 4.2,
      activeReviews: 0,
      completedReviews: 2,
      reviewStatus: "Completed"
    }
  },
  {
    id: "EMP-2024-006",
    name: "Diana Prince",
    email: "diana.p@enterprise-hrms.com",
    phone: "+1 (555) 987-6543",
    department: "Customer Success",
    designation: "Support Specialist",
    joiningDate: "2024-08-20",
    status: "Active",
    role: "Employee",
    avatarColor: "#8B5CF6",
    gender: "Female",
    dateOfBirth: "1993-11-10",
    address: "1 Gateway Plaza, Washington, DC",
    emergencyContact: {
      name: "Steve Trevor",
      relationship: "Partner",
      phone: "+1 (555) 987-6544"
    },
    payroll: {
      basic: 5200,
      allowances: 800,
      deductions: 300,
      tax: 500,
      net: 5200,
      status: "Processed"
    },
    leaveBalance: {
      sick: 12,
      casual: 12,
      paid: 20,
      sickUsed: 3,
      casualUsed: 1,
      paidUsed: 2
    },
    performance: {
      kpiScore: 89,
      rating: 4.4,
      activeReviews: 1,
      completedReviews: 1,
      reviewStatus: "Completed"
    }
  },
  {
    id: "EMP-2024-007",
    name: "Clark Kent",
    email: "clark.k@enterprise-hrms.com",
    phone: "+1 (555) 456-7890",
    department: "Sales & Marketing",
    designation: "Sales Director",
    joiningDate: "2024-04-01",
    status: "Active",
    role: "Employee",
    avatarColor: "#3B82F6",
    gender: "Male",
    dateOfBirth: "1989-02-28",
    address: "344 Clinton Street, Apt 3B, Metropolis, NY",
    emergencyContact: {
      name: "Lois Lane",
      relationship: "Spouse",
      phone: "+1 (555) 456-7891"
    },
    payroll: {
      basic: 10000,
      allowances: 3000,
      deductions: 900,
      tax: 1400,
      net: 10700,
      status: "Processed"
    },
    leaveBalance: {
      sick: 10,
      casual: 10,
      paid: 22,
      sickUsed: 0,
      casualUsed: 0,
      paidUsed: 3
    },
    performance: {
      kpiScore: 96,
      rating: 4.9,
      activeReviews: 0,
      completedReviews: 4,
      reviewStatus: "Completed"
    }
  },
  {
    id: "EMP-2024-008",
    name: "Barry Allen",
    email: "barry.a@enterprise-hrms.com",
    phone: "+1 (555) 123-9876",
    department: "Engineering",
    designation: "Software Engineer",
    joiningDate: "2024-09-15",
    status: "Active",
    role: "Employee",
    avatarColor: "#F43F5E",
    gender: "Male",
    dateOfBirth: "1995-03-05",
    address: "52 Speedster Way, Central City, MO",
    emergencyContact: {
      name: "Iris West",
      relationship: "Spouse",
      phone: "+1 (555) 123-9877"
    },
    payroll: {
      basic: 7000,
      allowances: 1000,
      deductions: 500,
      tax: 700,
      net: 6800,
      status: "Processed"
    },
    leaveBalance: {
      sick: 10,
      casual: 12,
      paid: 20,
      sickUsed: 2,
      casualUsed: 4,
      paidUsed: 1
    },
    performance: {
      kpiScore: 82,
      rating: 4.1,
      activeReviews: 1,
      completedReviews: 0,
      reviewStatus: "Active Reviews"
    }
  },
  {
    id: "EMP-2024-009",
    name: "Natasha Romanoff",
    email: "natasha.r@enterprise-hrms.com",
    phone: "+1 (555) 444-1111",
    department: "Human Resources",
    designation: "HR Manager",
    joiningDate: "2024-07-10",
    status: "Active",
    role: "HR Manager",
    avatarColor: "#65A30D",
    gender: "Female",
    dateOfBirth: "1984-11-22",
    address: "Classified Safehouse, New York, NY",
    emergencyContact: {
      name: "Clint Barton",
      relationship: "Friend",
      phone: "+1 (555) 444-2222"
    },
    payroll: {
      basic: 7700,
      allowances: 1100,
      deductions: 600,
      tax: 900,
      net: 7300,
      status: "Processed"
    },
    leaveBalance: {
      sick: 10,
      casual: 12,
      paid: 20,
      sickUsed: 1,
      casualUsed: 1,
      paidUsed: 0
    },
    performance: {
      kpiScore: 90,
      rating: 4.7,
      activeReviews: 0,
      completedReviews: 2,
      reviewStatus: "Completed"
    }
  },
  {
    id: "EMP-2024-010",
    name: "Steve Rogers",
    email: "steve.r@enterprise-hrms.com",
    phone: "+1 (555) 777-1776",
    department: "Customer Success",
    designation: "Support Specialist",
    joiningDate: "2024-03-01",
    status: "Suspended",
    role: "Employee",
    avatarColor: "#0284C7",
    gender: "Male",
    dateOfBirth: "1920-07-04",
    address: "569 Brooklyn Avenue, Brooklyn, NY",
    emergencyContact: {
      name: "Bucky Barnes",
      relationship: "Friend",
      phone: "+1 (555) 777-1777"
    },
    payroll: {
      basic: 5400,
      allowances: 800,
      deductions: 400,
      tax: 500,
      net: 5300,
      status: "Pending"
    },
    leaveBalance: {
      sick: 10,
      casual: 10,
      paid: 20,
      sickUsed: 8,
      casualUsed: 8,
      paidUsed: 15
    },
    performance: {
      kpiScore: 80,
      rating: 3.8,
      activeReviews: 0,
      completedReviews: 1,
      reviewStatus: "Completed"
    }
  }
];

export const initialAttendanceLogs = [
  // Today's logs
  { id: "LOG-001", employeeId: "EMP-2024-001", date: "2026-06-15", checkIn: "08:55 AM", checkOut: "05:30 PM", hours: 8.5, overtime: 0, status: "On-Time" },
  { id: "LOG-002", employeeId: "EMP-2024-002", date: "2026-06-15", checkIn: "09:05 AM", checkOut: "05:15 PM", hours: 8.1, overtime: 0, status: "On-Time" },
  { id: "LOG-003", employeeId: "EMP-2024-003", date: "2026-06-15", checkIn: "08:45 AM", checkOut: "06:15 PM", hours: 9.5, overtime: 1, status: "On-Time" },
  { id: "LOG-004", employeeId: "EMP-2024-005", date: "2026-06-15", checkIn: "09:45 AM", checkOut: "05:45 PM", hours: 8.0, overtime: 0, status: "Late" },
  { id: "LOG-005", employeeId: "EMP-2024-006", date: "2026-06-15", checkIn: "08:58 AM", checkOut: "05:00 PM", hours: 8.0, overtime: 0, status: "On-Time" },
  { id: "LOG-006", employeeId: "EMP-2024-007", date: "2026-06-15", checkIn: "08:30 AM", checkOut: "06:00 PM", hours: 9.5, overtime: 1, status: "On-Time" },
  { id: "LOG-007", employeeId: "EMP-2024-008", date: "2026-06-15", checkIn: "09:12 AM", checkOut: "01:15 PM", hours: 4.0, overtime: 0, status: "Half-Day" },
  { id: "LOG-008", employeeId: "EMP-2024-009", date: "2026-06-15", checkIn: "08:50 AM", checkOut: "05:30 PM", hours: 8.6, overtime: 0, status: "WFH" },
  
  // Previous logs for Trend Analytics
  { id: "LOG-101", employeeId: "EMP-2024-001", date: "2026-06-14", checkIn: "09:00 AM", checkOut: "05:30 PM", hours: 8.5, overtime: 0, status: "On-Time" },
  { id: "LOG-102", employeeId: "EMP-2024-002", date: "2026-06-14", checkIn: "08:55 AM", checkOut: "05:00 PM", hours: 8.0, overtime: 0, status: "On-Time" },
  { id: "LOG-103", employeeId: "EMP-2024-003", date: "2026-06-14", checkIn: "08:40 AM", checkOut: "06:40 PM", hours: 10.0, overtime: 1.5, status: "On-Time" },
  { id: "LOG-104", employeeId: "EMP-2024-004", date: "2026-06-14", checkIn: "", checkOut: "", hours: 0, overtime: 0, status: "Absent" },
  { id: "LOG-105", employeeId: "EMP-2024-005", date: "2026-06-14", checkIn: "09:15 AM", checkOut: "05:15 PM", hours: 8.0, overtime: 0, status: "Late" }
];

export const initialLeaveRequests = [
  {
    id: "LV-2026-001",
    employeeId: "EMP-2024-004",
    employeeName: "Sarah Connor",
    leaveType: "Paid Leave",
    startDate: "2026-06-12",
    endDate: "2026-06-18",
    totalDays: 5,
    reason: "Personal family event out of state.",
    status: "Approved",
    appliedDate: "2026-06-05"
  },
  {
    id: "LV-2026-002",
    employeeId: "EMP-2024-008",
    employeeName: "Barry Allen",
    leaveType: "Sick Leave",
    startDate: "2026-06-17",
    endDate: "2026-06-18",
    totalDays: 2,
    reason: "Dental cleaning and checkup.",
    status: "Pending",
    appliedDate: "2026-06-14"
  },
  {
    id: "LV-2026-003",
    employeeId: "EMP-2024-006",
    employeeName: "Diana Prince",
    leaveType: "Casual Leave",
    startDate: "2026-06-25",
    endDate: "2026-06-26",
    totalDays: 2,
    reason: "Vacation extension.",
    status: "Pending",
    appliedDate: "2026-06-12"
  },
  {
    id: "LV-2026-004",
    employeeId: "EMP-2024-010",
    employeeName: "Steve Rogers",
    leaveType: "Paid Leave",
    startDate: "2026-05-10",
    endDate: "2026-05-15",
    totalDays: 5,
    reason: "Visiting hometown.",
    status: "Rejected",
    appliedDate: "2026-05-01"
  }
];

export const initialRecruitmentJobs = [
  { id: "JOB-001", title: "Senior React Developer", department: "Engineering", type: "Full-Time", location: "Remote", status: "Active", vacancies: 2, applicants: 24 },
  { id: "JOB-002", title: "Lead Product Designer", department: "Product & Design", type: "Full-Time", location: "Hybrid", status: "Active", vacancies: 1, applicants: 15 },
  { id: "JOB-003", title: "Sales Executive", department: "Sales & Marketing", type: "Full-Time", location: "On-Site", status: "Active", vacancies: 3, applicants: 38 },
  { id: "JOB-004", title: "Technical HR Recruiter", department: "Human Resources", type: "Full-Time", location: "Remote", status: "Closed", vacancies: 1, applicants: 10 }
];

export const initialCandidates = [
  { id: "CAND-001", name: "Peter Parker", email: "peter.parker@dailybugle.com", jobTitle: "Senior React Developer", stage: "Applied", rating: 4.2, phone: "+1 (555) 999-0001", resume: "peter_parker_resume.pdf" },
  { id: "CAND-002", name: "Wanda Maximoff", email: "wanda.m@westview.org", jobTitle: "Senior React Developer", stage: "Screening", rating: 4.5, phone: "+1 (555) 999-0002", resume: "wanda_m_resume.pdf" },
  { id: "CAND-003", name: "Bruce Banner", email: "bruce.banner@gamma.edu", jobTitle: "Senior React Developer", stage: "Interview", rating: 4.9, phone: "+1 (555) 999-0003", resume: "banner_scientific_resume.pdf" },
  { id: "CAND-004", name: "Stephen Strange", email: "doctor@kamartaj.org", jobTitle: "Lead Product Designer", stage: "Technical Round", rating: 4.7, phone: "+1 (555) 999-0004", resume: "dr_strange_design_cv.pdf" },
  { id: "CAND-005", name: "Carol Danvers", email: "carol.danvers@starforce.mil", jobTitle: "Sales Executive", stage: "Offer", rating: 4.8, phone: "+1 (555) 999-0005", resume: "captain_marvel_sales.pdf" },
  { id: "CAND-006", name: "Thor Odinson", email: "thor.o@asgard.gov", jobTitle: "Sales Executive", stage: "Hired", rating: 4.6, phone: "+1 (555) 999-0006", resume: "thor_business_dev.pdf" }
];

export const companyHolidays = [
  { id: "HOL-001", title: "New Year's Day", date: "2026-01-01", type: "Public" },
  { id: "HOL-002", title: "Memorial Day", date: "2026-05-25", type: "Public" },
  { id: "HOL-003", title: "Juneteenth", date: "2026-06-19", type: "Public" },
  { id: "HOL-004", title: "Independence Day", date: "2026-07-04", type: "Public" },
  { id: "HOL-005", title: "Labor Day", date: "2026-09-07", type: "Public" },
  { id: "HOL-006", title: "Thanksgiving", date: "2026-11-26", type: "Public" },
  { id: "HOL-007", title: "Christmas Day", date: "2026-12-25", type: "Public" }
];

export const companyEvents = [
  { id: "EV-001", title: "Quarterly Townhall", date: "2026-06-18", time: "10:00 AM", type: "Meeting" },
  { id: "EV-002", title: "Design Feedback Review", date: "2026-06-23", time: "02:00 PM", type: "Workshop" },
  { id: "EV-003", title: "Company Summer Picnic", date: "2026-06-27", time: "11:00 AM", type: "Social" }
];

export const mockNotifications = [
  { id: "NOT-001", text: "Barry Allen submitted a Sick Leave Request", type: "leave", time: "10 mins ago", read: false },
  { id: "NOT-002", text: "New applicant Bruce Banner for Senior React Developer", type: "recruitment", time: "1 hour ago", read: false },
  { id: "NOT-003", text: "Monthly Payroll processing completed for May", type: "payroll", time: "2 days ago", read: true },
  { id: "NOT-004", text: "Quarterly performance appraisals have started", type: "performance", time: "3 days ago", read: true }
];

export const initialCompanySettings = {
  companyName: "Cygnux Enterprise Solutions",
  companyEmail: "info@cygnux.com",
  companyPhone: "+1 (555) 000-1111",
  currency: "USD",
  timezone: "UTC-5 (EST)",
  address: "500 Innovation Way, Tech District, NY 10001",
  fiscalYear: "January - December"
};

export const initialLeavePolicies = [
  { id: "POL-LV-1", type: "Sick Leave", allowance: 12, accrual: "Monthly", carryOver: false },
  { id: "POL-LV-2", type: "Casual Leave", allowance: 12, accrual: "Monthly", carryOver: true },
  { id: "POL-LV-3", type: "Paid Leave", allowance: 24, accrual: "Annual", carryOver: true }
];

export const initialPayrollPolicies = {
  pfContribution: 12, // %
  gratuityEligible: "5 Years",
  standardWorkingHours: 160, // Per month
  overtimeRate: 1.5, // multiplier
  taxSlab: [
    { upTo: 5000, rate: 10 },
    { upTo: 10000, rate: 15 },
    { upTo: 20000, rate: 25 },
    { above: 20000, rate: 30 }
  ]
};

export const initialRolesAndPermissions = [
  {
    role: "Admin",
    usersCount: 2,
    permissions: {
      staff: { create: true, read: true, update: true, delete: true },
      attendance: { create: true, read: true, update: true, delete: true },
      leave: { create: true, read: true, update: true, delete: true },
      payroll: { create: true, read: true, update: true, delete: true },
      recruitment: { create: true, read: true, update: true, delete: true },
      settings: { create: true, read: true, update: true, delete: true }
    }
  },
  {
    role: "HR Manager",
    usersCount: 2,
    permissions: {
      staff: { create: true, read: true, update: true, delete: false },
      attendance: { create: true, read: true, update: true, delete: false },
      leave: { create: true, read: true, update: true, delete: false },
      payroll: { create: false, read: true, update: false, delete: false },
      recruitment: { create: true, read: true, update: true, delete: true },
      settings: { create: false, read: true, update: false, delete: false }
    }
  },
  {
    role: "Employee",
    usersCount: 6,
    permissions: {
      staff: { create: false, read: true, update: false, delete: false },
      attendance: { create: true, read: true, update: false, delete: false },
      leave: { create: true, read: true, update: false, delete: false },
      payroll: { create: false, read: true, update: false, delete: false },
      recruitment: { create: false, read: false, update: false, delete: false },
      settings: { create: false, read: false, update: false, delete: false }
    }
  }
];
