import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const registerCompany = async (data) => {
  return axios.post(
    `${API_URL}/company/register`,
    data
  );
};

export const login = async (data) => {
  return axios.post(
    `${API_URL}/auth/login`,
    data
  );
};