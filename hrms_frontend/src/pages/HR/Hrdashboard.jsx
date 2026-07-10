import { useState, useEffect, useMemo } from "react";
import { useHRMSData } from "../../context/HRMSDataContext";
import PageHeader from "../../components/layouts/PageHeader";
import KPICard from "../../components/cards/KPICard";
import { PieChartComponent, BarChartComponent } from "../../components/charts/ChartWrappers";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Avatar from "../../components/common/Avatar"; 
import {
  MdPeople,
  MdCheckCircle,
  MdCancel,
  MdEventNote,
  MdHourglassEmpty,
  MdWorkOutline,
  MdCheck,
  MdClose
} from "react-icons/md";
import { toast } from "react-toastify";
import { getAllLeave, getAllStaff, updateLeaveStatus } from "../../services/api";

const Hrdashboard = () => {
  const {
    employees: contextEmployees,
    leaveRequests: contextLeaves,
    currentUser
  } = useHRMSData();

  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [staffRes, leavesRes] = await Promise.all([
        getAllStaff(),
        getAllLeave()
      ]);

      if (staffRes.data?.success && staffRes.data?.data) {
        setEmployees(staffRes.data.data);
      } else {
        setEmployees(contextEmployees);
      }

      if (leavesRes.data?.success && leavesRes.data?.data) {
        setLeaves(leavesRes.data.data);
      } else {
        setLeaves(contextLeaves);
      }
    } catch (err) {
      console.warn("Failed to fetch live HR dashboard data, falling back to mock context:", err);
      setEmployees(contextEmployees);
      setLeaves(contextLeaves);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await updateLeaveStatus(id, status);
      toast.success(res.data?.message || `Leave request ${status.toLowerCase()} successfully`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update leave status");
    }
  };

  // KPI calculations
  const stats = useMemo(() => {
    const total = employees.length || contextEmployees.length;
    const pending = leaves.filter((l) => l.status === "PENDING").length;
    const approved = leaves.filter((l) => l.status === "APPROVED").length;
    const activeLeaves = leaves.filter((l) => {
      if (l.status !== "APPROVED") return false;
      const today = new Date().toISOString().split("T")[0];
      return l.fromDate <= today && l.toDate >= today;
    }).length;

    // Simulate recruitment status
    const recruitmentOpenings = 4;

    return { total, pending, approved, activeLeaves, recruitmentOpenings };
  }, [employees, leaves, contextEmployees]);

  // Chart Data preparation
  const departmentData = useMemo(() => {
    const counts = {};
    employees.forEach((emp) => {
      // Handle backend API department relation
      const deptName = emp.department?.name || emp.department || "General";
      counts[deptName] = (counts[deptName] || 0) + 1;
    });
    
    const chartData = Object.keys(counts).map((dept) => ({
      name: dept,
      value: counts[dept]
    }));

    return chartData.length > 0 ? chartData : [{ name: "HR", value: 3 }, { name: "Engineering", value: 12 }, { name: "Sales", value: 5 }];
  }, [employees]);

  const leaveAnalyticsData = useMemo(() => {
    const counts = {};
    leaves.forEach((req) => {
      counts[req.leaveType] = (counts[req.leaveType] || 0) + 1;
    });
    const chartData = Object.keys(counts).map((type) => ({
      name: type,
      value: counts[type]
    }));
    return chartData.length > 0 ? chartData : [{ name: "Casual Leave", value: 4 }, { name: "Sick Leave", value: 3 }, { name: "Paid Leave", value: 5 }];
  }, [leaves]);

  const pendingApprovals = useMemo(() => {
    return leaves
      .filter((r) => r.status === "PENDING" || r.status === "Pending")
      .map((leave) => {
        const emp = employees.find((e) => e.id === leave.staffId);
        return {
          ...leave,
          employeeName: emp?.fullName || leave.employeeName || `Employee (ID: ${leave.staffId})`,
          avatarColor: emp?.avatarColor || "#2563EB"
        };
      });
  }, [leaves, employees]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <PageHeader title="HR Command Center" subtitle="Loading HR data..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 h-96" />
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-100 h-96" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="HR Dashboard"
        subtitle={`Welcome back, ${currentUser?.name || "HR Admin"} | Corporate Operations & Talent`}
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-7">
        <KPICard title="Total Employees" value={stats.total} icon={<MdPeople />} trend="+2 this month" color="blue" />
        <KPICard title="Pending Leaves" value={stats.pending} icon={<MdHourglassEmpty />} trend="Needs action" color="amber" />
        <KPICard title="On Leave Today" value={stats.activeLeaves} icon={<MdEventNote />} trend="Active approvals" color="rose" />
        <KPICard title="Approved Leaves" value={stats.approved} icon={<MdCheckCircle />} trend="Total approved" color="emerald" />
        <KPICard title="Active Openings" value={stats.recruitmentOpenings} icon={<MdWorkOutline />} trend="Hiring active" color="violet" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-7">
        {/* Pending Approvals Widget */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 p-6 flex flex-col min-h-[400px]">
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-between">
            <span>Pending Leave Requests ({pendingApprovals.length})</span>
            <span className="text-xs text-slate-400 font-normal">Requires Action</span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[350px] pr-1">
            {pendingApprovals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-sm text-slate-400 dark:text-slate-500 py-16">
                <MdCheckCircle className="text-4xl text-emerald-500 mb-2" />
                All leave requests are processed!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                      <th className="pb-3">Employee</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Dates</th>
                      <th className="pb-3">Days</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApprovals.map((req) => {
                      const totalDays = Math.ceil(
                        (new Date(req.toDate) - new Date(req.fromDate)) / (1000 * 60 * 60 * 24)
                      ) + 1;
                      
                      return (
                        <tr key={req.id} className="border-b border-slate-50 dark:border-slate-800/50 last:border-none group">
                          <td className="py-3.5 flex items-center gap-3">
                            <Avatar name={req.employeeName} color={req.avatarColor} size={32} />
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">{req.employeeName}</span>
                              <span className="text-[10px] text-slate-400">ID: {req.staffId}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-slate-600 dark:text-slate-400 font-medium">
                            {req.leaveType}
                          </td>
                          <td className="py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                            {req.fromDate} to {req.toDate}
                          </td>
                          <td className="py-3.5 text-slate-700 dark:text-slate-300 font-bold">
                            {totalDays} d
                          </td>
                          <td className="py-3.5 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleStatusUpdate(req.id, "APPROVED")}
                                style={{ padding: "6px" }}
                                aria-label="Approve Leave"
                              >
                                <MdCheck />
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleStatusUpdate(req.id, "REJECTED")}
                                style={{ padding: "6px" }}
                                aria-label="Reject Leave"
                              >
                                <MdClose />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Headcount Breakdown chart */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 p-6 flex flex-col">
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
            Department Headcount
          </div>
          <div className="flex-1 min-h-[300px]">
            <PieChartComponent data={departmentData} nameKey="name" valueKey="value" />
          </div>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 p-6">
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-between">
            <span>Requested Leave Types Analytics</span>
            <span className="text-xs text-slate-400 font-normal">All-Time Distribution</span>
          </div>
          <div className="h-[280px]">
            <BarChartComponent data={leaveAnalyticsData} xKey="name" yKey="value" color="#F59E0B" label="Requests Count" />
          </div>
        </div>

        {/* HR Operations Quick Links */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">Operations Shortcuts</h3>
            <div className="flex flex-col gap-3">
              <a href="/employees" className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary/20 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition-all group">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Staff Management</span>
                  <span className="text-[10px] text-slate-400">Add, edit and monitor employees</span>
                </div>
                <span className="text-primary text-xs font-bold group-hover:translate-x-1 transition-transform">Go &rarr;</span>
              </a>

              <a href="/departments" className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary/20 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition-all group">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Departments Overview</span>
                  <span className="text-[10px] text-slate-400">Configure business divisions</span>
                </div>
                <span className="text-primary text-xs font-bold group-hover:translate-x-1 transition-transform">Go &rarr;</span>
              </a>

              <a href="/payroll" className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary/20 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition-all group">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Payroll Processing</span>
                  <span className="text-[10px] text-slate-400">Calculate net salaries & basic payroll</span>
                </div>
                <span className="text-primary text-xs font-bold group-hover:translate-x-1 transition-transform">Go &rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 text-center mt-6">
            Cygnux HRMS v1.0 • System Role: HR Manager
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hrdashboard;