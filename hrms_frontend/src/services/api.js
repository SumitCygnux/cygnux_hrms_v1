import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export const registerCompany = (data) =>
  api.post("/auth/register-company", data);

export const login = (data) =>
  api.post("/auth/login", data);

export const getProfile = () =>
  api.get("/auth/profile");
  
export const getDepartments = () =>
  api.get("/departments");

export const createDepartment = (data) =>
  api.post("/departments", data);

export const updateDepartment = (id, data) =>
  api.put(`/departments/${id}`, data);

export const deleteDepartment = (id) =>
  api.delete(`/departments/${id}`);

export const getDepartmentHeadOptions = () =>
  api.get("/departments/head-options");


export const getDesignations = () =>
  api.get("/designations");

export const createDesignation = (data) =>
  api.post("/designations", data);

export const updateDesignation = (id, data) =>
  api.put(`/designations/${id}`, data);

export const deleteDesignation = (id) =>
  api.delete(`/designations/${id}`);

export const getAllStaff = () =>
  api.get("/staff");

export const createStaff = (data) => {
  console.log("SENDING DATA:", data);
  return api.post("/staff", data);
};

export const getStaffById = (id) =>
  api.get(`/staff/${id}`);

export const getDesignationByDepartment = (departmentId) =>
  api.get(`/designations/department/${departmentId}`);


export const setupStaffPassword = (newPassword) =>
  api.put("/staff/setup-password", { newPassword });

export const getRoles = () =>
  api.get("/roles");

export const createRole = (data) =>
  api.post("/roles", data);

export const updateRole = (id, data) =>
  api.put(`/roles/${id}`, data);


export const getPermissions = () =>
  api.get("/permissions");

export const getRolePermissions = (roleId) =>
  api.get(`/role-permissions/${roleId}`);

export const saveRolePermissions = (data) =>
  api.post("/role-permissions", data);

export const updateStaff = (id, data) => {
  return api.put(`/staff/${id}`, data);
};

// leave api
export const applyLeave = (data) => {
  return api.post("/leave/apply", data);
};

export const getLeave = (data) => {
  return api.get("/leave/", data);
};

export const getAllLeave = (data) => {
  return api.get("/staff/leave", data);
};


// attendance api
export const clockIn = () => api.post("/attendance/clock-in");
export const clockOut = () => api.post("/attendance/clock-out");
export const breakIn = () => api.post("/attendance/break-in");
export const breakOut = () => api.post("/attendance/break-out");
export const getTodayAttendance = () => api.get("/attendance/today");
export const getAttendanceHistory = (params) => api.get("/attendance/history", { params });
export const resetTodayAttendance = () => api.delete("/attendance/reset");


export const getAttendanceMetrics = () => api.get("/attendance/dashboard/metrics");
export const getAttendanceCharts = () => api.get("/attendance/dashboard/charts");
export const getAttendanceRecords = (params) => api.get("/attendance/records", { params });
export const updateAttendanceRecord = (id, data) => api.put(`/attendance/records/${id}`, data);

export const createShift = (data) => api.post("/attendance/shifts", data);
export const getShifts = () => api.get("/attendance/shifts");
export const getShiftById = (id) => api.get(`/attendance/shifts/${id}`);
export const updateShift = (id, data) => api.put(`/attendance/shifts/${id}`, data);
export const deleteShift = (id) => api.delete(`/attendance/shifts/${id}`);


export const createShiftAssignment = (data) => api.post("/attendance/shift-assignment", data);
export const getShiftAssignments = () => api.get("/attendance/shift-assignment");
export const updateShiftAssignment = (id, data) => api.put(`/attendance/shift-assignment/${id}`, data);


export const getAttendanceSettings = () => api.get("/attendance/settings");
export const updateAttendanceSettings = (data) => api.put("/attendance/settings", data);


export const createHoliday = (data) => api.post("/attendance/holidays", data);
export const getHolidays = () => api.get("/attendance/holidays");
export const updateHoliday = (id, data) => api.put(`/attendance/holidays/${id}`, data);
export const deleteHoliday = (id) => api.delete(`/attendance/holidays/${id}`);


export const getAttendanceRequests = () => api.get("/attendance/requests");
export const getAttendanceRequestById = (id) => api.get(`/attendance/requests/${id}`);
export const approveAttendanceRequest = (id, data) => api.put(`/attendance/requests/${id}/approve`, data);
export const rejectAttendanceRequest = (id, data) => api.put(`/attendance/requests/${id}/reject`, data);

//get staff profile

export const  getMyProfile = (data) => {
  return api.get("/myprofile", data);
};

export const  updateMyProfile = (data) => {
  return api.put("/myprofile", data);
};




export default api;