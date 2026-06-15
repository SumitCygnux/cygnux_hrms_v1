import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/auth";

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