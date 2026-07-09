import { useState, useMemo, useEffect } from "react";
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
  MdAdd,
} from "react-icons/md";
import { toast } from "react-hot-toast";
import { getAllLeave ,getAllStaff, updateLeaveStatus} from "../../../services/api";

const Leave = () => {
  const {
    leaveRequests,
  } = useHRMSData();

  const [leaves, setLeaves] = useState([]);
    const [employees, setEmployees] = useState([]);
 
  useEffect(() => {
     fetchLeaves(),
     fetchStaff()
   }, []);

 const fetchStaff = async () => {
    try {
      const res = await getAllStaff();
      console.log("fetchStaff", res.data.data);
      setEmployees(res.data.data); 
    } catch (err) {
      console.log(err);
    }
  };
  const fetchLeaves = async () => {
    try {
      const res = await getAllLeave();
      console.log("Leaves", res.data.data);
      setLeaves(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await updateLeaveStatus(id, status);
      toast.success(res.data.message || `Leave request ${status.toLowerCase()} successfully`);
      fetchLeaves();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update leave status");
    }
  };


  const [statusFilter, setStatusFilter] = useState("All");

  const filteredLeaveRequests = useMemo(() => {
  return leaves
    .map((leave) => {
      const emp = employees.find((e) => e.id === leave.staffId);

      return {
        ...leave,
        employeeName: emp?.fullName || "-",
      };
    })
    .filter(
      (leave) =>
        statusFilter === "All" || leave.status === statusFilter
    );
}, [leaves, employees, statusFilter]);

  
const stats = useMemo(() => {
  return {
    total: leaves.length,
    approved: leaves.filter(l => l.status === "APPROVED").length,
    rejected: leaves.filter(l => l.status === "REJECTED").length,
    pending: leaves.filter(l => l.status === "PENDING").length,
  };
}, [leaves]);

  const columns = [
    {
      header: "Employee",
      accessor: "employeeName",
      sortable: true,
      render: (row) => {
        const emp = employees.find((e) => e.id === row.staffId);
        return (
          <div className="flex items-center gap-3">
            <Avatar
              name={row.employeeName}
              color={emp?.avatarColor || "#2563EB"}
              size={36}
            />
            <div className="flex flex-col">
              <span className="font-semibold text-text-primary">
                {row.employeeName}
              </span>
              <span className="text-xs text-text-secondary">
                ID: {row.staffId}
              </span>
            </div>
          </div>
        );
      },
    },
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
      header: "Reason",
      accessor: "reason",
      sortable: false,
      render: (row) => row.reason || "No reason provided.",
    },
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
      render: (row) => {
        if (row.status !== "PENDING")
          return (
            <span className="text-gray-400 text-xs font-semibold">
              Processed
            </span>
          );
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="success"
              onClick={() => handleStatusUpdate(row.id, "APPROVED")}
              style={{ padding: "6px" }}
              aria-label="Approve Leave"
            >
              <MdCheck />
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleStatusUpdate(row.id, "REJECTED")}
              style={{ padding: "6px" }}
              aria-label="Reject Leave"
            >
              <MdClose />
            </Button>
          </div>

        );
      },
    },
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
            <span className="text-xs font-semibold text-text-secondary uppercase">
              Total Requests
            </span>
            <span className="text-3xl font-extrabold text-text-primary">
              {stats.total}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-primary-light text-primary">
            <MdEventNote />
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">
              Approved
            </span>
            <span className="text-3xl font-extrabold text-text-primary">
              {stats.approved}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-success-light text-success">
            <MdCheckCircle />
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">
              Rejected
            </span>
            <span className="text-3xl font-extrabold text-text-primary">
              {stats.rejected}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-danger-light text-danger">
            <MdCancel />
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">
              Pending
            </span>
            <span className="text-3xl font-extrabold text-text-primary">
              {stats.pending}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-warning-light text-warning">
            <MdHourglassEmpty />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-7 items-start">
    

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
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredLeaveRequests}
          pageSize={5}
          emptyMessage="No leave requests filed."
        />
      </div>
    </div>
  );
};

export default Leave;
