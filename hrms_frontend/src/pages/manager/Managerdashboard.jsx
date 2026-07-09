import { useState, useEffect, useMemo } from "react";
import { useHRMSData } from "../../context/HRMSDataContext";
import PageHeader from "../../components/layouts/PageHeader";
import KPICard from "../../components/cards/KPICard";
import { BarChartComponent, PieChartComponent } from "../../components/charts/ChartWrappers";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Avatar from "../../components/common/Avatar";
import {
  MdPeople,
  MdCheckCircle,
  MdCancel,
  MdEventNote,
  MdHourglassEmpty,
  MdCheck,
  MdClose,
  MdSchedule
} from "react-icons/md";
import { toast } from "react-toastify";
import { getAllLeave, getAllStaff, updateLeaveStatus } from "../../services/api";

const Managerdashboard = () => {
  const {
    employees: contextEmployees,
    leaveRequests: contextLeaves,
    attendanceLogs: contextLogs,
    currentUser
  } = useHRMSData();

  const [profile, setProfile] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch manager profile to identify departmentId
      let resolvedDeptId = null;
      let resolvedDeptName = "";
      try {
        const profileRes = await getMyProfile();
        if (profileRes.data?.success && profileRes.data?.data) {
          setProfile(profileRes.data.data);
          resolvedDeptId = profileRes.data.data.departmentId;
          resolvedDeptName = profileRes.data.data.department?.name || "";
        }
      } catch (err) {
        console.warn("Failed to fetch manager profile, falling back to mock:", err);
      }

      // 2. Fetch all staff and leaves
      const [staffRes, leavesRes] = await Promise.all([
        getAllStaff(),
        getAllLeave()
      ]);

      let allStaff = [];
      if (staffRes.data?.success && staffRes.data?.data) {
        allStaff = staffRes.data.data;
      } else {
        allStaff = contextEmployees;
      }

      let allLeaves = [];
      if (leavesRes.data?.success && leavesRes.data?.data) {
        allLeaves = leavesRes.data.data;
      } else {
        allLeaves = contextLeaves;
      }

      // 3. Filter by department
      if (resolvedDeptId) {
        const filteredStaff = allStaff.filter((emp) => emp.departmentId === resolvedDeptId);
        setEmployees(filteredStaff);
        
        const staffIds = new Set(filteredStaff.map((emp) => emp.id));
        const filteredLeaves = allLeaves.filter((leave) => staffIds.has(leave.staffId));
        setLeaves(filteredLeaves);
      } else {
        // Fallback: If no department found, show all or standard mock
        setEmployees(allStaff);
        setLeaves(allLeaves);
      }

    } catch (err) {
      console.error("Error loading manager dashboard data:", err);
      setEmployees(contextEmployees);
      setLeaves(contextLeaves);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagerData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await updateLeaveStatus(id, status);
      toast.success(res.data?.message || `Leave request ${status.toLowerCase()} successfully`);
      fetchManagerData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update leave status");
    }
  };

  // KPI Metrics scoped to team
  const teamStats = useMemo(() => {
    const total = employees.length;
    const pending = leaves.filter((l) => l.status === "PENDING" || l.status === "Pending").length;
    const onLeave = leaves.filter((l) => {
      if (l.status !== "APPROVED" && l.status !== "Approved") return false;
      const today = new Date().toISOString().split("T")[0];
      return l.fromDate <= today && l.toDate >= today;
    }).length;

    // Attendance rate calculation (simulate today logs for team members)
    // Find today checked in count in team
    const teamMemberIds = new Set(employees.map(e => e.id));
    const todayStr = new Date().toISOString().split("T")[0];
    
    // Filter logs for today that belong to team
    const todayLogs = contextLogs.filter(log => teamMemberIds.has(log.employeeId) && log.date === todayStr);
    const present = todayLogs.filter(
      (l) => l.status === "On-Time" || l.status === "Late" || l.status === "WFH" || l.status === "Half-Day"
    ).length;

    const presentRate = total > 0 ? Math.round((present / total) * 100) : 92;

    return { total, pending, onLeave, present, presentRate };
  }, [employees, leaves, contextLogs]);

  // Chart preparation
  const teamAttendanceChartData = useMemo(() => {
    return [
      { name: "Mon", value: 95 },
      { name: "Tue", value: 92 },
      { name: "Wed", value: 98 },
      { name: "Thu", value: 96 },
      { name: "Fri", value: teamStats.presentRate },
    ];
  }, [teamStats.presentRate]);

  const teamLeaveTypeChartData = useMemo(() => {
    const counts = {};
    leaves.forEach((req) => {
      counts[req.leaveType] = (counts[req.leaveType] || 0) + 1;
    });
    const chartData = Object.keys(counts).map((type) => ({
      name: type,
      value: counts[type]
    }));
    return chartData.length > 0 ? chartData : [{ name: "Sick Leave", value: 2 }, { name: "Casual Leave", value: 4 }];
  }, [leaves]);

  const pendingApprovals = useMemo(() => {
    return leaves
      .filter((r) => r.status === "PENDING" || r.status === "Pending")
      .map((leave) => {
        const emp = employees.find((e) => e.id === leave.staffId);
        return {
          ...leave,
          employeeName: emp?.fullName || leave.employeeName || `Team Member (ID: ${leave.staffId})`,
          avatarColor: emp?.avatarColor || "#2563EB"
        };
      });
  }, [leaves, employees]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <PageHeader title="Manager Leadership" subtitle="Loading team metrics..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 h-[380px]" />
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-100 h-[380px]" />
        </div>
      </div>
    );
  }

  const deptName = profile?.department?.name || "Department";

  return (
    <div>
      <PageHeader
        title="Manager Dashboard"
        subtitle={`Welcome back, ${currentUser?.name || "Manager"} · ${deptName} Leadership Hub`}
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <KPICard title="Team Size" value={teamStats.total} icon={<MdPeople />} trend="Department Staff" color="blue" />
        <KPICard title="Present Today" value={`${teamStats.presentRate}%`} icon={<MdCheckCircle />} trend="Attendance rate" color="emerald" />
        <KPICard title="On Leave Today" value={teamStats.onLeave} icon={<MdEventNote />} trend="Active approvals" color="rose" />
        <KPICard title="Pending Leave Approvals" value={teamStats.pending} icon={<MdHourglassEmpty />} trend="Requires review" color="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-7">
        {/* Leave Requests pipeline */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 p-6 flex flex-col min-h-[400px]">
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-between">
            <span>Team Leave Approvals ({pendingApprovals.length})</span>
            <span className="text-xs text-slate-400 font-normal">Department Approvals</span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[350px] pr-1">
            {pendingApprovals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-sm text-slate-400 dark:text-slate-500 py-16">
                <MdCheckCircle className="text-4xl text-emerald-500 mb-2" />
                No pending leaves in your team!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                      <th className="pb-3">Team Member</th>
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

        {/* Team Leave Analytics chart */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between">
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
            Team Leave Distribution
          </div>
          <div className="flex-1 min-h-[300px]">
            <PieChartComponent data={teamLeaveTypeChartData} nameKey="name" valueKey="value" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Attendance Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 p-6">
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-between">
            <span>Team Attendance Trend (%)</span>
            <span className="text-xs text-slate-400 font-normal">Last 5 Days</span>
          </div>
          <div className="h-[280px]">
            <BarChartComponent data={teamAttendanceChartData} xKey="name" yKey="value" color="#10B981" label="Attendance (%)" />
          </div>
        </div>

        {/* Team Members List */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center justify-between">
              <span>Team Members ({employees.length})</span>
              <span className="text-[10px] text-slate-400">Status</span>
            </h3>
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[220px] pr-1">
              {employees.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-8">
                  No staff members registered in your department.
                </div>
              ) : (
                employees.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Avatar name={emp.fullName} color={emp.avatarColor || "#2563EB"} size={28} />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{emp.fullName}</span>
                        <span className="text-[9px] text-slate-400">{emp.designationName || emp.role || "Team Member"}</span>
                      </div>
                    </div>
                    <Badge status={emp.status === "Active" ? "Active" : "InActive"}>
                      {emp.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="text-[10px] text-slate-400 text-center mt-4">
            Cygnux HRMS v1.0 • System Role: Manager
          </div>
        </div>
      </div>
    </div>
  );
};

export default Managerdashboard;