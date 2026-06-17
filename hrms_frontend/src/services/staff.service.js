import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAllStaff = () => {
  return axios.get(
    `${API_URL}/staff`,
    getAuthHeaders()
  );
};

export const createStaff = (data) => {
  console.log("SENDING DATA:", data);

  return axios.post(
    `${API_URL}/staff`,
    data,
    getAuthHeaders()
  );
};