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
        actions={
          <Button variant="primary" iconBefore={<MdAdd />} onClick={() => setIsApplyModalOpen(true)}>
            Apply for Leave
          </Button>
        }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-7 items-start">
        {/* Left Sidebar widgets */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Balance Widget */}
          <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-border-color">My Leave Balances</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="font-semibold text-sm">Sick Leave</span>
                <Badge status="Active">
                  {userBalance.sick - userBalance.sickUsed} / {userBalance.sick} Remaining
                </Badge>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="font-semibold text-sm">Casual Leave</span>
                <Badge status="Late">
                  {userBalance.casual - userBalance.casualUsed} / {userBalance.casual} Remaining
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">Paid Leave</span>
                <Badge status="WFH">
                  {userBalance.paid - userBalance.paidUsed} / {userBalance.paid} Remaining
                </Badge>
              </div>
            </div>
          </div>

          {/* Workflow Timeline */}
          <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-border-color">Leave Approval Path</h3>
            <div className="flex flex-col gap-5">
              <div className="flex gap-4 relative">
                <div className="absolute left-[11px] top-6 bottom-[-20px] w-[2px] bg-border-color z-0" />
                <div className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold z-10 flex-shrink-0">1</div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-text-primary">Submission</span>
                  <span className="text-[10px] text-text-secondary">Employee files request</span>
                </div>
              </div>
              <div className="flex gap-4 relative">
                <div className="absolute left-[11px] top-6 bottom-[-20px] w-[2px] bg-border-color z-0" />
                <div className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold z-10 flex-shrink-0">2</div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-text-primary">Line Manager Review</span>
                  <span className="text-[10px] text-text-secondary">Approves/Rejects request</span>
                </div>
              </div>
              <div className="flex gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold z-10 flex-shrink-0">3</div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-text-primary">HR Administration</span>
                  <span className="text-[10px] text-text-secondary">Updates calendars & payroll</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-bg-secondary border border-border-color rounded-2xl shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-lg text-gray-800">Leave Requests Pipeline</h3>
          </div>
          <DataTable columns={columns} data={leaveRequests} pageSize={5} emptyMessage="No leave requests filed." />
        </div>
      </div>

      {/* Apply Leave Modal */}
      <DetailModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="File Leave Request"
        maxWidth="500px"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Leave Type</label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
            >
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Paid Leave">Paid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Start Date</label>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">End Date</label>
              <input
                type="date"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleChange}
                className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Reason / Description</label>
            <textarea
              name="reason"
              rows="3"
              required
              placeholder="Provide a brief explanation for leave..."
              value={formData.reason}
              onChange={handleChange}
              className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
            <Button variant="secondary" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Request
            </Button>
          </div>
        </form>
      </DetailModal>
    </div>
  );
};

export default Leave;
