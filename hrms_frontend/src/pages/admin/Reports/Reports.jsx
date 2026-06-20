import { useState, useMemo, useEffect } from "react";
import { useHRMSData } from "../../../context/HRMSDataContext";
import PageHeader from "../../../components/layouts/PageHeader";
import DataTable from "../../../components/tables/DataTable";
import Button from "../../../components/common/Button";
import Badge from "../../../components/common/Badge";
import Tabs from "../../../components/common/Tabs";
import { MdFileDownload } from "react-icons/md";

import {
  getDepartments,
  getDesignations,
  getAllStaff,
  getAllLeave,
} from "../../../services/api";

const Reports = () => {
  const { attendanceLogs, leaveRequests } = useHRMSData();
  const [activeTab, setActiveTab] = useState("employees");
  const [selectedDept, setSelectedDept] = useState("All");

  const [leaves, setLeaves] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);

  const tabs = [
    { id: "employees", label: "Employee Reports" },
    { id: "attendance", label: "Attendance Reports" },
    { id: "leaves", label: "Leave Reports" },
    { id: "payroll", label: "Payroll Reports" },
  ];

  useEffect(() => {
    fetchDepartments();
    fetchStaff();
    fetchDesignations();
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await getAllLeave();
      console.log("Leaves", res.data.data);
      setLeaves(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments();
      console.log(res.data);
      setDepartments(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDesignations = async () => {
    try {
      const res = await getDesignations();
      console.log("Designation", res.data);

      setDesignations(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await getAllStaff();
      console.log("fetchStaff", res.data.data);
      setEmployees(res.data.data); 

    } catch (err) {
      console.log(err);
    }
  };
  
  const employeeReportData = useMemo(() => {
    return employees
      .map((emp) => ({
        ...emp,
        department:
          departments.find((d) => d.id === emp.departmentId)?.name || "-",
        designation:
          designations.find((d) => d.id === emp.designationId)?.title || "-",
      }))
      .filter(
        (emp) => selectedDept === "All" || emp.department === selectedDept,
      );
  }, [employees, departments, designations, selectedDept]);


  const attendanceReportData = useMemo(() => {
    return attendanceLogs.filter((log) => {
      const emp = employees.find((e) => e.id === log.employeeId);
      return emp && (selectedDept === "All" || emp.department === selectedDept);
    });
  }, [attendanceLogs, employees, selectedDept]);

 
  const leaveReportData = useMemo(() => {
    return leaves
      .map((leave) => {
        const emp = employees.find((e) => e.id === leave.staffId);

        return {
          ...leave,
          employeeName: emp?.fullName || "-",
          department:
            departments.find((d) => d.id === emp?.departmentId)?.name || "-",
        };
      })
      .filter((row) => {
        console.log(row.department, selectedDept);
        return selectedDept === "All" || row.department === selectedDept;
      });
  }, [leaves, employees, departments, selectedDept]);


  const payrollReportData = useMemo(() => {
    return employees.filter(
      (emp) => selectedDept === "All" || emp.department === selectedDept,
    );
  }, [employees, selectedDept]);

 
  const handleExport = () => {
    let headers = [];
    let rows = [];
    let filename = `report_${activeTab}_${new Date().toISOString().split("T")[0]}.csv`;

    if (activeTab === "employees") {
      headers = ["ID,Name,Department,Designation,Joining Date,Status"];
      rows = employeeReportData.map(
        (e) =>
          `"${e.id}","${e.name}","${e.department}","${e.designation}","${e.joiningDate}","${e.status}"`,
      );
    } else if (activeTab === "attendance") {
      headers = ["Employee ID,Date,Check In,Check Out,Working Hours,Status"];
      rows = attendanceReportData.map(
        (l) =>
          `"${l.employeeId}","${l.date}","${l.checkIn}","${l.checkOut}","${l.hours}","${l.status}"`,
      );
    } else if (activeTab === "leaves") {
      headers = [
        "Employee Name,Leave Type,Start Date,End Date,Total Days,Status",
      ];
      rows = leaveReportData.map(
        (r) =>
          `"${r.employeeName}","${r.leaveType}","${r.startDate}","${r.endDate}","${r.totalDays}","${r.status}"`,
      );
    } else if (activeTab === "payroll") {
      headers = [
        "ID,Name,Department,Basic Salary,Allowances,Deductions,Net Salary",
      ];
      rows = payrollReportData.map(
        (p) =>
          `"${p.id}","${p.name}","${p.department}","${p.payroll?.basic}","${p.payroll?.allowances}","${p.payroll?.deductions}","${p.payroll?.net}"`,
      );
    }

    const blob = new Blob([[headers.join("\n"), ...rows].join("\n")], {
      type: "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    a.click();
  };

  

  const empColumns = [
    { header: "ID", accessor: "id", sortable: true },
    {
      header: "Employee Name",
      accessor: "name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-semibold text-text-primary">
              {row.fullName}
            </span>
          </div>
        </div>
      ),
    },
    { header: "Department", accessor: "department", sortable: true },
    { header: "Designation", accessor: "designation", sortable: true },
    {
      header: "Joining Date",
      accessor: "joiningDate",
      sortable: true,
      render: (row) => <span>{row.joiningDate?.split("T")[0]}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      render: (row) => <Badge status={row.status}>{row.status}</Badge>,
    },
  ];

  const attColumns = [
    { header: "Emp ID", accessor: "employeeId", sortable: true },
    { header: "Date", accessor: "date", sortable: true },
    { header: "Check In", accessor: "checkIn", sortable: false },
    { header: "Check Out", accessor: "checkOut", sortable: false },
    {
      header: "Working Hours",
      accessor: "hours",
      sortable: true,
      render: (row) => `${row.hours} hrs`,
    },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      render: (row) => <Badge status={row.status}>{row.status}</Badge>,
    },
  ];

  const leaveColumns = [
    { header: "Employee", accessor: "employeeName", sortable: true },
    { header: "Department", accessor: "department", sortable: true },
    { header: "Leave Type", accessor: "leaveType", sortable: true },
    { header: "Start Date", accessor: "fromDate", sortable: true },
    { header: "End Date", accessor: "toDate", sortable: true },
    {
      header: "Total Days",
      accessor: "totalDays",
      sortable: true,
     render: (row) =>
        `${
          Math.ceil(
            (new Date(row.toDate) - new Date(row.fromDate)) /
              (1000 * 60 * 60 * 24),
          ) + 1
        } Days`,
    },

    {
      header: "Status",
      accessor: "status",
      sortable: true,
      render: (row) => <Badge status={row.status}>{row.status}</Badge>,
    },
  ];

  const payrollColumns = [
    { header: "ID", accessor: "id", sortable: true },
    { header: "Name", accessor: "name", sortable: true },
    { header: "Department", accessor: "department", sortable: true },
    {
      header: "Basic Salary",
      accessor: "payroll.basic",
      sortable: true,
      render: (row) => `$${row.payroll?.basic.toLocaleString()}`,
    },
    {
      header: "Allowances",
      accessor: "payroll.allowances",
      sortable: true,
      render: (row) => `$${row.payroll?.allowances.toLocaleString()}`,
    },
    {
      header: "Deductions",
      accessor: "payroll.deductions",
      sortable: true,
      render: (row) => `$${row.payroll?.deductions.toLocaleString()}`,
    },
    {
      header: "Net Salary",
      accessor: "payroll.net",
      sortable: true,
      render: (row) => `$${row.payroll?.net.toLocaleString()}`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Aggregate data export and metrics visualizations"
      />

      {/* Main card */}
      <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Filter Row */}
        <div className="flex justify-between items-center gap-4 mb-6 flex-wrap">
          <div className="flex gap-3 items-center flex-wrap">
            <label className="text-sm font-semibold text-gray-500">
              Department:
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none cursor-pointer focus:border-primary transition-all"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            iconBefore={<MdFileDownload />}
            onClick={handleExport}
          >
            Export Report CSV
          </Button>
        </div>

        {/* Dynamic Table Render */}
        {activeTab === "employees" && (
          <DataTable
            columns={empColumns}
            data={employeeReportData}
            pageSize={5}
          />
        )}
        {activeTab === "attendance" && (
          <DataTable
            columns={attColumns}
            data={attendanceReportData}
            pageSize={5}
          />
        )}
        {activeTab === "leaves" && (
          <DataTable
            columns={leaveColumns}
            data={leaveReportData}
            pageSize={5}
          />
        )}
        {activeTab === "payroll" && (
          <DataTable
            columns={payrollColumns}
            data={payrollReportData}
            pageSize={5}
          />
        )}
      </div>
    </div>
  );
};

export default Reports;
