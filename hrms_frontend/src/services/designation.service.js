import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getDesignations = () => {
  return axios.get(`${API_URL}/designations`,
    getAuthHeaders()
  );
};

export const createDesignation = (data) => {
  return axios.post(
    `${API_URL}/designations`,
    data,
    getAuthHeaders()
  );
};