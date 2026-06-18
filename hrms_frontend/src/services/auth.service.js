import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const registerCompany = (data) => {
  return axios.post(
    `${API_URL}/register-company`,
    data
  );
};

export const login = (data) => {
  return axios.post(
    `${API_URL}/login`,
    data
  );
};

export const getProfile = (token) => {
  return axios.get(
    `${API_URL}/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};