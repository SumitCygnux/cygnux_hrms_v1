import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  MdUpdate,
  MdVisibility,
} from "react-icons/md";

import {
  getDepartments,
  getDesignations,
  getAllStaff,
  createStaff,
  getDesignationByDepartment,
  getRoles,
  updateStaff,
} from "../../../services/api";

import { toast } from "react-toastify";
import { usePermission } from "../../../hooks/usePermission";

const EmployeeList = () => {
  const { canView, canCreate, canUpdate, canDelete } = usePermission("staff");
  if (!canView) {
    return <h2>You don't have permission</h2>;
  }
  const navigate = useNavigate();
  // STATE
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [roles, setRoles] = useState([]);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // const [showForm, setShowForm] = useState(false);
  const [activeView, setActiveView] = useState("list");
  const [editId, setEditId] = useState(null);

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

        name: e.fullName,

        department:
          dept.data.data.find((d) => d.id === e.departmentId)?.name || "-",

        designation:
          desig.data.data.find((d) => d.id === e.designationId)?.title || "-",

        accessRole:
          roleRes.data.data.find((r) => r.id === e.accessRoleId)?.name || "-",
      }));

      setEmployees(formattedEmployees);

      setDepartments(dept.data.data);
      setRoles(roleRes.data.data);

    } catch (err) {
      console.log(err);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const name = String(emp?.name ?? "");
      const id = String(emp?.id ?? "");
      const email = String(emp?.email ?? "");
 const empCode = String(emp?.employeeCode ?? ""); 
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



  const handleAdd = () => {
    setEditId(null);

    setFormData({
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

  // CSV Exporter
  const exportToCSV = () => {
    const headers = [
      "Employee ID,Name,Department,Designation,Email,Phone,password,Joining Date,Status",
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
            <span className="text-xs text-text-secondary">{row.employeeCode}</span>
          </div>
        </div>
      ),
    },
    { header: "Department", accessor: "department", sortable: true },
    { header: "Designation", accessor: "designation", sortable: true },
    { header: "Email", accessor: "email", sortable: true },
    { header: "Phone", accessor: "phone", sortable: false },
    {
      header: "Joining Date",
      accessor: "joiningDate",
      sortable: true,
      render: (row) => <span>{row.joiningDate?.split("T")[0]}</span>,
    },

    { header: "Role", accessor: "role", sortable: true },
    { header: "Access Role", accessor: "accessRole", sortable: true },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      render: (row) => <Badge status={row.status}>{row.status}</Badge>,
    },

     ...(canUpdate
    ? [ { 
      header: "Actions",
      accessor: "actions",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Link to={`/employees/${row.id}`}>
           {
             canUpdate && (
                <Button
              size="sm"
              variant="ghost"
              className=" group flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-blue-600 shadow-sm  hover:border-blue-400  hover:bg-blue-100  hover:shadow-md  transition-all  "
              iconBefore={
                <MdVisibility className="text-lg group-hover:scale-110 transition-transform" />
              }
            >
              Profile
            </Button>
            )
           }
          </Link>

          { canUpdate &&(
              
          <Button
            size="sm"
            variant="ghost"
            className="group flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-green-600 shadow-sm hover:border-green-400 hover:bg-green-100 hover:shadow-md transition-all "
            iconBefore={
              <MdUpdate className="text-lg group-hover:rotate-12 transition-transform" />
            }
            onClick={() => navigate(`/updateemployee/${row.id}`)}
          >
            Update
          </Button>
            )} 
        </div>
      ),
    },
  
    ]
    : [])
  
  ];



  return (
    <div>
      <PageHeader
        title="Staff Management"
        subtitle="View and manage company staff directory"
        actions={
          canCreate && (
            <Button
              variant="primary"
              iconBefore={<MdPersonAdd />}
              // onClick={handleAdd}
              onClick={() => navigate("/addemployee")}
            >
              Add Employee
            </Button>
          )
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
      <DataTable columns={columns} data={filteredEmployees} />
    </div>
  );
};

export default EmployeeList;
