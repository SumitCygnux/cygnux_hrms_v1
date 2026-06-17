import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../../components/layouts/PageHeader";
import DataTable from "../../../components/tables/DataTable";
import Button from "../../../components/common/Button";
import Badge from "../../../components/common/Badge";
import Avatar from "../../../components/common/Avatar";
import DetailModal from "../../../components/modals/DetailModal";
import {
  MdSearch,
  MdPersonAdd,
  MdFileDownload,
  MdDelete,
  MdVisibility,
} from "react-icons/md";

import {
  getDepartments,
  getDesignations,
  getAllStaff,
  createStaff,
  deleteStaff,
} from "../../services/api";


const EmployeeList = () => {
  // const { employees, addEmployee, deleteEmployee, departments, designations } = useHRMSData();
  // STATE
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    departmentId: "",
    designationId: "",
    joiningDate: new Date().toISOString().split("T")[0],
    gender: "Male",
    dob: "1994-01-01",
    address: "",
    salary: "8000",
  });

  useEffect(() => {
    loadData();
  
  }, []);

const loadData = async () => {
  try {
    const emp = await getAllStaff();
    const dept = await getDepartments();
    const desig = await getDesignations();

    const formattedEmployees = emp.data.data.map((e) => ({
      ...e,

      name: e.fullName,

      department:
        dept.data.data.find((d) => d.id === e.departmentId)?.name || "-",

     
      designation:
        desig.data.data.find((d) => d.id === e.designationId)?.title || "-",
    }));

    setEmployees(formattedEmployees);
    setDepartments(dept.data.data);
    setDesignations(desig.data.data);

    console.log("Employees", formattedEmployees);
  } catch (err) {
    console.log(err);
  }
};


  // Filter logic
  // const filteredEmployees = useMemo(() => {
  //   return employees.filter((emp) => {
  //     const name = emp?.name ?? "";
  //     const id = emp?.id ?? "";
  //     const email = emp?.email ?? "";

  //     const search = searchQuery.toLowerCase();

  //     const matchesSearch =
  //       name.toLowerCase().includes(search) ||
  //       id.toLowerCase().includes(search) ||
  //       email.toLowerCase().includes(search);

  //     const matchesDept =
  //       selectedDept === "All" || emp?.department === selectedDept;

  //     const matchesStatus =
  //       selectedStatus === "All" || emp?.status === selectedStatus;

  //     return matchesSearch && matchesDept && matchesStatus;
  //   });
  // }, [employees, searchQuery, selectedDept, selectedStatus]);

  const filteredEmployees = useMemo(() => {
  return employees.filter((emp) => {
    const name = String(emp?.name ?? "");
    const id = String(emp?.id ?? "");
    const email = String(emp?.email ?? "");

    const search = searchQuery.toLowerCase();

    const matchesSearch =
      name.toLowerCase().includes(search) ||
      id.toLowerCase().includes(search) ||
      email.toLowerCase().includes(search);

    const matchesDept =
      selectedDept === "All" || emp?.department === selectedDept;

    const matchesStatus =
      selectedStatus === "All" || emp?.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });
}, [employees, searchQuery, selectedDept, selectedStatus]);

 console.log("filteredEmployees =>", filteredEmployees);


  // CREATE STAFF
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,

        departmentId: formData.departmentId,
        designationId: formData.designationId,

        dob: formData.dob,
        joiningDate: formData.joiningDate,
        salary: Number(formData.salary),
        address: formData.address,
      };

      await createStaff(payload);

      setIsModalOpen(false);
      loadData(); // refresh
    } catch (err) {
  console.log("STATUS:", err.response?.status);
  console.log("DATA:", err.response?.data);
  console.log("FULL ERROR:", err.response);
}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // CSV Exporter
  const exportToCSV = () => {
    const headers = [
      "Employee ID,Name,Department,Designation,Email,Phone,Joining Date,Status",
    ];
    const rows = filteredEmployees.map(
      (e) =>
        `"${e.id}","${e.name}","${e.department}","${e.designation}","${e.email}","${e.phone}","${e.joiningDate}","${e.status}"`,
    );
    const blob = new Blob([[headers, ...rows].join("\n")], {
      type: "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `employees_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    a.click();
  };

  // Table columns definition
  const columns = [
    {
      header: "Employee Name",
      accessor: "name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} color={row.avatarColor} size={36} />
          <div className="flex flex-col">
            <span className="font-semibold text-text-primary">{row.name}</span>
            <span className="text-xs text-text-secondary">{row.id}</span>
          </div>
        </div>
      ),
    },
    { header: "Department", accessor: "department", sortable: true },
    { header: "Designation", accessor: "designation", sortable: true },
    { header: "Email", accessor: "email", sortable: true },
    { header: "Phone", accessor: "phone", sortable: false },
    { header: "Joining Date", accessor: "joiningDate", sortable: true },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      render: (row) => <Badge status={row.status}>{row.status}</Badge>,
    },
    {
      header: "Actions",
      accessor: "actions",
      sortable: false,
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/employees/${row.id}`}>
            <Button
              size="sm"
              variant="ghost"
              iconBefore={<MdVisibility className="text-lg" />}
              aria-label="View Profile"
            />
          </Link>
          <Button
            size="sm"
            variant="ghost"
            className="hover:text-red-500!"
            iconBefore={<MdDelete className="text-lg text-red-500" />}
            onClick={() => deleteEmployee(row.id)}
            aria-label="Delete Employee"
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Staff Management"
        subtitle="View and manage company staff directory"
        actions={
          <Button
            variant="primary"
            iconBefore={<MdPersonAdd />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Employee
          </Button>
        }
      />

      {/* Filter Row */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6 bg-bg-secondary border border-border-color rounded-lg p-4 md:px-6 md:py-4 shadow-sm">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 flex-1 items-stretch sm:items-center">
          <div className="flex items-center bg-bg-primary border border-border-color rounded-md px-3 py-2 w-full sm:w-[260px] gap-2">
            <MdSearch className="text-text-muted text-lg" />
            <input
              type="text"
              placeholder="Search by name, ID or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none bg-transparent outline-none w-full text-xs text-text-primary"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-md border border-border-color bg-bg-primary text-text-primary text-xs outline-none cursor-pointer w-full sm:w-auto transition-all focus:border-primary"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-md border border-border-color bg-bg-primary text-text-primary text-xs outline-none cursor-pointer w-full sm:w-auto transition-all focus:border-primary"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
         
          </select>
        </div>

        <div className="flex gap-3 items-center justify-end">
          <Button
            variant="secondary"
            iconBefore={<MdFileDownload />}
            onClick={exportToCSV}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Employee Table */}
      <DataTable
        columns={columns}
        data={filteredEmployees}
        pageSize={8}
        emptyMessage="No employees found matching the filters."
      />

      {/* Add Employee Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Employee"
        maxWidth="700px"
      >
        <form onSubmit={handleSubmit}>
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

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
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
                <option value="Other">Other</option>
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
                onChange={handleChange}
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

            {/* Designation (IMPORTANT FIX: ID store) */}
            {/* <div className="flex flex-col gap-1.5">
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
            </div> */}

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
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" variant="primary">
              Register Employee
            </Button>
          </div>
        </form>
      </DetailModal>
    </div>
  );
};

export default EmployeeList;
