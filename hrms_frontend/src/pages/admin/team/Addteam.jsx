
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";

import {
  createTeam,
  updateTeam,
  getTeamById,
  getDepartments,
} from "../../../services/api";

function AddTeam() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    teamName: "",
    departmentId: "",
    status: "Active",
  });

  useEffect(() => {
    loadDepartments();

    if (id) {
      loadTeam(id);
    }
  }, [id]);

  // Load Departments
  const loadDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Load Team By Id
  const loadTeam = async (teamId) => {
    try {
      const res = await getTeamById(teamId);


      

      const team = res.data.data;

      setFormData({
        teamName: team.teamName || "",
        departmentId: team.departmentId || "",
        status: team.status || "Active",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await updateTeam(id, formData);
        toast.success("Team Updated Successfully");
      } else {
        await createTeam(formData);
        toast.success("Team Created Successfully");
      }

      navigate("/team");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-3xl font-bold">
            {id ? "Update Team" : "Add Team"}
          </h2>

          <p className="text-gray-500 mt-1">
            {id
              ? "Update the team details."
              : "Create a new team."}
          </p>

          <div className="w-24 h-1 bg-blue-900 rounded mt-2"></div>
        </div>

        <div className="grid grid-cols-2 gap-5">

          <div>
            <label className="block mb-2 font-medium">
              Team Name
            </label>

            <input
              type="text"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter Team Name"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Department
            </label>

            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Department</option>

              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/team")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
          >
            {id ? "Update Team" : "Create Team"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddTeam;