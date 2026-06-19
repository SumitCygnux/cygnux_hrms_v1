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


export default api;