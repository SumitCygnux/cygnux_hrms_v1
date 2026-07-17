import React, { useEffect, useState } from "react";
import Button from "../../../components/common/Button";
import { useNavigate, useParams } from "react-router-dom";

import {
  getDepartments,
  getDesignations,
  createStaff,
  getDesignationByDepartment,
  getRoles,
  updateStaff,
  getAllStaff,
} from "../../../services/api";
import { toast } from "react-toastify";

function Addemployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editId, setEditId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [roles, setRoles] = useState([]);
   

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    departmentId: "",
    designationId: "",
    joiningDate: new Date().toISOString().split("T")[0],
    gender: "Male",
    dob: "1994-01-01",
    address: "",
    role: "",
    accessRoleId: "",
    salary: "8000",
  });




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      departmentId,
      designationId: "",
    }));

    if (!departmentId) {
      setDesignations([]);
      return;
    }

    try {
      const response = await getDesignationByDepartment(departmentId);
      setDesignations(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      gender: formData.gender,
      departmentId: formData.departmentId,
      designationId: formData.designationId,
      dob: formData.dob,
      joiningDate: formData.joiningDate,
      salary: Number(formData.salary),
      role: formData.role,
      accessRoleId: formData.accessRoleId,
      address: formData.address,
    };
    console.log("payload", payload);
    try {
      if (id) {
        await updateStaff(id, payload);
        toast.success("Employee Updated Successfully");
      } else {
        await createStaff(payload);
        toast.success("Employee Added Successfully");
      }

      loadData();

      setEditId(null);

      navigate("/employees");
    } catch (error) {
      console.log(error);
    }
  };


   const handleEdit = (employee) => {
    setEditId(employee.id);

    setFormData({
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      departmentId: employee.departmentId,
      designationId: employee.designationId,
      joiningDate: employee.joiningDate?.split("T")[0],
      gender: employee.gender,
      dob: employee.dob?.split("T")[0],
      address: employee.address,
      role: employee.role,
      accessRoleId: employee.accessRoleId,
      salary: employee.salary,
    });

    
  };


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const emp = await getAllStaff();
      const dept = await getDepartments();
      const desig = await getDesignations();
      const roleRes = await getRoles();

      const formattedEmployees = emp.data.data.map((e) => ({
        ...e,

        department:
          dept.data.data.find((d) => d.id === e.departmentId)?.name || "-",

        designation:
          desig.data.data.find((d) => d.id === e.designationId)?.title || "-",

        accessRole:
          roleRes.data.data.find((r) => r.id === e.accessRoleId)?.name || "-",
      }));

      setEmployees(formattedEmployees);
          if (id) {
      const employee = formattedEmployees.find(
        (emp) => String(emp.id) === String(id)
      );


      if (employee) {
        handleEdit(employee);

        const response = await getDesignationByDepartment(employee.departmentId);
        setDesignations(response.data.data);
      }
    }

      setDepartments(dept.data.data);
      setRoles(roleRes.data.data);

      console.log("Employees =>", formattedEmployees);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* <h2>{editId ? "Update Employee" : "Add Employee"}</h2> */}

 <div className="mb-6">
  <h2 className="text-3xl font-bold text-gray-800">
    {id ? "Update Employee" : "Add Employee"}
  </h2>
  <p className="text-sm text-gray-500 mt-1">
    {id
      ? "Update employee details below."

      : "Fill in the details to create a new employee."}
  </p>

   <div className="w-[100px] h-1 bg-blue-900 rounded mt-2"></div>
</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Full Name
            </label>
            <input
              type="text"
              required
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. john.d@company.com"
              className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              disabled={!!editId}
              onChange={handleChange}
              placeholder="Enter Password"
              className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              maxLength="10"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 9876543210"
              className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Department (IMPORTANT FIX: ID store) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Department
            </label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleDepartmentChange}
              className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Designation */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Designation
            </label>

            <select
              name="designationId"
              value={formData.designationId}
              onChange={handleChange}
              className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary"
            >
              <option value="">Select Designation</option>

              {designations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>

          {/* DOB */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Joining Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Joining Date
            </label>
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Salary */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Basic Monthly Salary ($)
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Role
            </label>
            <input
              type="text"
              required
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Access Role
            </label>

            <select
              name="accessRoleId"
              value={formData.accessRoleId}
              onChange={handleChange}
              className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary"
            >
              <option value="">Select Role</option>

              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="col-span-1 sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Home Address
            </label>
            <textarea
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street name, City, Zipcode..."
              className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border-color mt-6">
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate("/employees")}
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary">
            {id ? "Update Employee" : "Register Employee"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Addemployee;
