import axios from "axios";

const API_URL =
"http://localhost:5000/api/v1/departments";

export const getDepartments = () => {

  const token =
  localStorage.getItem("token");

  return axios.get(
    API_URL,
    {
      headers: {
        Authorization:
        `Bearer ${token}`
      }
    }
  );
};

export const createDepartment = (
  data
) => {

  const token =
  localStorage.getItem("token");

  return axios.post(
    API_URL,
    data,
    {
      headers: {
        Authorization:
        `Bearer ${token}`
      }
    }
  );
};