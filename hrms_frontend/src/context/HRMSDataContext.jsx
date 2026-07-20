
import { createContext, useContext, useEffect, useState } from "react";
import {
  initialEmployees,
  initialDepartments,
  initialDesignations,
  initialAttendanceLogs,
  initialLeaveRequests,
  initialRecruitmentJobs,
  initialCandidates,
  initialCompanySettings,
  initialPayrollPolicies,
  initialRolesAndPermissions,
  mockNotifications
} from "../data/mockData";
import {
  getLeavePolicies,
  createLeavePolicy,
  updateLeavePolicy,
  deleteLeavePolicy
} from "../services/api";

const HRMSDataContext = createContext();




export const HRMSDataProvider = ({ children }) => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [departments, setDepartments] = useState(initialDepartments);
  const [designations] = useState(initialDesignations);
  const [attendanceLogs, setAttendanceLogs] = useState(initialAttendanceLogs);
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [recruitmentJobs] = useState(initialRecruitmentJobs);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [companySettings, setCompanySettings] = useState(initialCompanySettings);
  const [leavePolicies, setLeavePolicies] = useState([]); 
  const [payrollPolicies, setPayrollPolicies] = useState(initialPayrollPolicies);
  const [rolesAndPermissions] = useState(initialRolesAndPermissions);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [currentUser, setCurrentUser] = useState(() => {
  const user = localStorage.getItem("user");


  return user
    ? JSON.parse(user)
    : {
        id: "",
        name: "",
        email: "",
        role: "",
        companyName: "",
        avatarColor: "#2563EB",
      };
});






  // Notifications helper
  const addNotification = (text, type = "info") => {
    const newNotification = {
      id: `NOT-${Date.now()}`,
      text,
      type,
      time: "Just now",
      read: false
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // State actions
  const addEmployee = (newEmp) => {
    const newId = `EMP-2024-0${employees.length + 1}`;
    const formattedEmp = {
      ...newEmp,
      id: newId,
      status: "Active",
      avatarColor: ["#2563EB", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"][Math.floor(Math.random() * 6)],
      payroll: {
        basic: parseInt(newEmp.basicSalary || 6000),
        allowances: parseInt(newEmp.allowances || 1000),
        deductions: parseInt(newEmp.deductions || 500),
        tax: Math.floor(parseInt(newEmp.basicSalary || 6000) * 0.15),
        net: parseInt(newEmp.basicSalary || 6000) + parseInt(newEmp.allowances || 1000) - parseInt(newEmp.deductions || 500),
        status: "Pending"
      },
      leaveBalance: {
        sick: 10,
        casual: 12,
        paid: 20,
        sickUsed: 0,
        casualUsed: 0,
        paidUsed: 0
      },
      performance: {
        kpiScore: 85,
        rating: 4.0,
        activeReviews: 0,
        completedReviews: 0,
        reviewStatus: "Completed"
      }
    };
    setEmployees((prev) => [formattedEmp, ...prev]);
    // update department headcount 
    setDepartments((prev) =>
      prev.map((d) => (d.name === newEmp.department ? { ...d, headcount: d.headcount + 1 } : d))
    );
    addNotification(`New employee ${newEmp.name} added to ${newEmp.department}`, "staff");
  };

  const updateEmployee = (id, updatedData) => {
    setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, ...updatedData } : emp)));
    addNotification(`Profile updated for ${updatedData.name || id}`, "staff");
  };

  const deleteEmployee = (id) => {
    const emp = employees.find((e) => e.id === id);
    if (!emp) return;
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    // update department headcount
    setDepartments((prev) =>
      prev.map((d) => (d.name === emp.department ? { ...d, headcount: Math.max(0, d.headcount - 1) } : d))
    );
    addNotification(`Employee ${emp.name} removed from record`, "staff");
  };

  const addLeaveRequest = (newLeave) => {
    const leaveId = `LV-2026-0${leaveRequests.length + 1}`;
    const totalDays = Math.ceil(
      (new Date(newLeave.endDate) - new Date(newLeave.startDate)) / (1000 * 60 * 60 * 24)
    ) + 1;
    const leaveItem = {
      ...newLeave,
      id: leaveId,
      totalDays,
      status: "Pending",
      appliedDate: new Date().toISOString().split("T")[0]
    };
    setLeaveRequests((prev) => [leaveItem, ...prev]);
    addNotification(`${newLeave.employeeName} submitted a ${newLeave.leaveType} Request`, "leave");
  };

  const updateLeaveRequestStatus = (id, status) => {
    const request = leaveRequests.find((r) => r.id === id);
    if (!request) return;
    
    setLeaveRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));

    if (status === "Approved") {
      // Deduct leave balance
      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp.id === request.employeeId) {
            const balanceKey = request.leaveType.toLowerCase().split(" ")[0]; // sick, casual, paid
            const usedKey = `${balanceKey}Used`;
            const updatedUsed = (emp.leaveBalance[usedKey] || 0) + request.totalDays;
            
            return {
              ...emp,
              status: "On Leave",
              leaveBalance: {
                ...emp.leaveBalance,
                [usedKey]: updatedUsed
              }
            };
          }
          return emp;
        })
      );
      addNotification(`Leave request ${id} approved for ${request.employeeName}`, "leave");
    } else if (status === "Rejected") {
      addNotification(`Leave request ${id} rejected for ${request.employeeName}`, "leave");
    }
  };

  const addCandidate = (newCand) => {
    const candId = `CAND-0${candidates.length + 1}`;
    const formatted = {
      ...newCand,
      id: candId,
      stage: "Applied",
      rating: 4.0,
      resume: "uploaded_resume.pdf"
    };
    setCandidates((prev) => [...prev, formatted]);
    addNotification(`New candidate ${newCand.name} applied for ${newCand.jobTitle}`, "recruitment");
  };

  const updateCandidateStage = (id, stage) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, stage } : c)));
    const c = candidates.find((cand) => cand.id === id);
    if (c) {
      addNotification(`Candidate ${c.name} moved to stage: ${stage}`, "recruitment");
    }
  };

  const updateSettings = (updatedSettings) => {
    setCompanySettings((prev) => ({ ...prev, ...updatedSettings }));
    addNotification("Company settings updated successfully", "settings");
  };

  const fetchLeavePolicies = async () => {
  try {
    const res = await getLeavePolicies();

    console.log("leave policies",res.data.data);
    setLeavePolicies(res.data.data  ); 

  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  fetchLeavePolicies();
}, []);

const createPolicy = async (data) => {
  await createLeavePolicy(data);
  await fetchLeavePolicies();
  addNotification("Leave Policy Created", "settings");
};

const updatePolicy = async (id, data) => {
  await updateLeavePolicy(id, data);
  await fetchLeavePolicies();
  addNotification("Leave Policy Updated", "settings");
};

const deletePolicy = async (id) => {
  await deleteLeavePolicy(id);
  await fetchLeavePolicies();
  addNotification("Leave Policy Deleted", "settings");
};


  const updatePayrollPolicies = (policies) => {
    setPayrollPolicies(policies);
    addNotification("Payroll rules updated", "settings");
  };

  const handleClockInOut = (employeeId) => {
    const today = new Date().toISOString().split("T")[0];
    const existingLog = attendanceLogs.find((l) => l.employeeId === employeeId && l.date === today);

    if (existingLog) {
      // Clock Out
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setAttendanceLogs((prev) =>
        prev.map((log) =>
          log.id === existingLog.id
            ? { ...log, checkOut: timeStr, hours: 8.5, status: "On-Time" } // mock 8.5 hours
            : log
        )
      );
      addNotification(`Clocked out successfully at ${timeStr}`, "attendance");
    } else {
      // Clock In
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newLog = {
        id: `LOG-${Date.now()}`,
        employeeId,
        date: today,
        checkIn: timeStr,
        checkOut: "",
        hours: 0,
        overtime: 0,
        status: "On-Time"
      };
      setAttendanceLogs((prev) => [newLog, ...prev]);
      addNotification(`Clocked in successfully at ${timeStr}`, "attendance");
    }
  };

  return (
    <HRMSDataContext.Provider
      value={{
        employees,
        departments,
        setDepartments,
        designations,

        attendanceLogs,
        leaveRequests,
        recruitmentJobs,
        candidates,
        companySettings,
        leavePolicies,
        fetchLeavePolicies,
        createPolicy,
        updatePolicy,
        deletePolicy,
        payrollPolicies,
        rolesAndPermissions,
        notifications,
        currentUser,
        setCurrentUser,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addLeaveRequest,
        updateLeaveRequestStatus,
        addCandidate,
        updateCandidateStage,
        updateSettings,
     
        updatePayrollPolicies,
        handleClockInOut,
        addNotification,
        markAllNotificationsAsRead
      }}
    >
      {children}
    </HRMSDataContext.Provider>
  );
};

export const useHRMSData = () => {
  const context = useContext(HRMSDataContext);
  if (!context) {
    throw new Error("useHRMS Data must be used within an HRMSDataProvider");
  }
  return context;
};
