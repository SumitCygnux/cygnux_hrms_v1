import { useState, useMemo } from "react";
import { useHRMSData } from "../../../context/HRMSDataContext";
import PageHeader from "../../../components/layouts/PageHeader";
import DataTable from "../../../components/tables/DataTable";
import Button from "../../../components/common/Button";
import Badge from "../../../components/common/Badge";
import Avatar from "../../../components/common/Avatar";
import DetailModal from "../../../components/modals/DetailModal";
import {
  MdEventNote,
  MdCheckCircle,
  MdCancel,
  MdHourglassEmpty,
  MdCheck,
  MdClose,
  MdAdd
} from "react-icons/md";

const Leave = () => {
  const {
    leaveRequests,
    employees,
    currentUser,
    addLeaveRequest,
    updateLeaveRequestStatus
  } = useHRMSData();

  // Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
const [statusFilter, setStatusFilter] = useState("All"); 
const filteredLeaveRequests = useMemo(() => {
  if (statusFilter === "All") {
    return leaveRequests;
  }

  return leaveRequests.filter(
    (leave) => leave.status === statusFilter
  );
}, [leaveRequests, statusFilter]);
  // Form State
  const [formData, setFormData] = useState({
    leaveType: "Sick Leave",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    reason: ""
  });

  // Calculations
  const stats = useMemo(() => {
    const total = leaveRequests.length;
    const approved = leaveRequests.filter((r) => r.status === "Approved").length;
    const rejected = leaveRequests.filter((r) => r.status === "Rejected").length;
    const pending = leaveRequests.filter((r) => r.status === "Pending").length;
    return { total, approved, rejected, pending };
  }, [leaveRequests]);

  // Current logged in user's balances
  const userBalance = useMemo(() => {
    const emp = employees.find((e) => e.id === currentUser.id);
    return emp ? emp.leaveBalance : { sick: 10, casual: 12, paid: 20, sickUsed: 0, casualUsed: 0, paidUsed: 0 };
  }, [employees, currentUser.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addLeaveRequest({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      ...formData
    });
    setIsApplyModalOpen(false);
    setFormData({
      leaveType: "Sick Leave",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      reason: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Table Columns
  const columns = [
    {
      header: "Employee",
      accessor: "employeeName",
      sortable: true,
      render: (row) => {
        const emp = employees.find((e) => e.id === row.employeeId);
        return (
          <div className="flex items-center gap-3">
            <Avatar name={row.employeeName} color={emp?.avatarColor || "#2563EB"} size={36} />
            <div className="flex flex-col">
              <span className="font-semibold text-text-primary">{row.employeeName}</span>
              <span className="text-xs text-text-secondary">{row.employeeId}</span>
            </div>
          </div>
        );
      }
    },
    { header: "Leave Type", accessor: "leaveType", sortable: true },
    { header: "Start Date", accessor: "startDate", sortable: true },
    { header: "End Date", accessor: "endDate", sortable: true },
    { header: "Total Days", accessor: "totalDays", sortable: true, render: (row) => `${row.totalDays} Days` },
    { header: "Reason", accessor: "reason", sortable: false, render: (row) => row.reason || "No reason provided." },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      render: (row) => <Badge status={row.status}>{row.status}</Badge>
    },
    {
      header: "Actions",
      accessor: "actions",
      sortable: false,
      render: (row) => {
        if (row.status !== "Pending") return <span className="text-gray-400 text-xs font-semibold">Processed</span>;
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="success"
              onClick={() => updateLeaveRequestStatus(row.id, "Approved")}
              style={{ padding: "6px" }}
              aria-label="Approve Leave"
            >
              <MdCheck />
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => updateLeaveRequestStatus(row.id, "Rejected")}
              style={{ padding: "6px" }}
              aria-label="Reject Leave"
            >
              <MdClose />
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div>
      <PageHeader
        title="Leave Management"
        subtitle="Manage and apply for employee leaves"
      
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">Total Requests</span>
            <span className="text-3xl font-extrabold text-text-primary">{stats.total}</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-primary-light text-primary">
            <MdEventNote />
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">Approved</span>
            <span className="text-3xl font-extrabold text-text-primary">{stats.approved}</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-success-light text-success">
            <MdCheckCircle />
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">Rejected</span>
            <span className="text-3xl font-extrabold text-text-primary">{stats.rejected}</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-danger-light text-danger">
            <MdCancel />
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">Pending</span>
            <span className="text-3xl font-extrabold text-text-primary">{stats.pending}</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-warning-light text-warning">
            <MdHourglassEmpty />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-7 items-start">
        {/* Left Sidebar widgets */}
      
          

        {/* Leave Requests Table */}
        {/* <div className="bg-bg-secondary border border-border-color rounded-2xl shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-lg text-gray-800">Leave Requests Pipeline</h3>
          </div>
          <DataTable columns={columns} data={leaveRequests} pageSize={5} emptyMessage="No leave requests filed." />
        </div> */}

        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  <h3 className="font-bold text-lg text-gray-800">
    Leave Requests Pipeline
  </h3>

  <div className="flex items-center gap-3">
    <label className="text-sm font-medium text-gray-600">
      Filter By Status
    </label>

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="All">All</option>
      <option value="Pending">Pending</option>
      <option value="Approved">Approved</option>
      <option value="Rejected">Rejected</option>
    </select>
  
  </div>
    
</div>
   <DataTable columns={columns}  data={filteredLeaveRequests} pageSize={5} emptyMessage="No leave requests filed." />
      </div>

    
    </div>
  );
};

export default Leave;
