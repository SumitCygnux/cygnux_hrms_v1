import { useMemo } from "react";
import { useHRMSData } from "../../context/HRMSDataContext";
import PageHeader from "../../components/layout/PageHeader";
import KPICard from "../../components/cards/KPICard";
import {
  AreaChartComponent,
  BarChartComponent,
  PieChartComponent
} from "../../components/charts/ChartWrappers";
import {
  MdPeople,
  MdCheckCircle,
  MdCancel,
  MdEventNote,
  MdPersonAdd,
  MdAttachMoney,
  MdEvent,
  MdHourglassEmpty,
  MdCheck,
  MdClose,
  MdSchedule
} from "react-icons/md";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { companyHolidays, companyEvents } from "../../data/mockData";

const Dashboard = () => {
  const {
    employees,
    attendanceLogs,
    leaveRequests,
    updateLeaveRequestStatus,
    currentUser
  } = useHRMSData();

  // 1. KPI Calculations
  const stats = useMemo(() => {
    const total = employees.length;
    
    // Check-in details for "today" (simulated as 2026-06-15)
    const todayStr = "2026-06-15";
    const todayLogs = attendanceLogs.filter((l) => l.date === todayStr);
    
    const present = todayLogs.filter(
      (l) => l.status === "On-Time" || l.status === "Late" || l.status === "WFH" || l.status === "Half-Day"
    ).length;
    
    const absent = employees.filter((e) => e.status === "Suspended").length + 
      todayLogs.filter((l) => l.status === "Absent").length;
      
    const onLeave = employees.filter((e) => e.status === "On Leave").length;
    
    // New joiners in 2024 (our mock data timeline is 2024)
    const newJoiners = employees.filter((e) => {
      const joinDate = new Date(e.joiningDate);
      return joinDate >= new Date("2024-06-01");
    }).length;

    // Net Payroll
    const payrollCost = employees.reduce((sum, emp) => sum + (emp.payroll?.net || 0), 0);

    return { total, present, absent, onLeave, newJoiners, payrollCost };
  }, [employees, attendanceLogs]);

  // 2. Chart Data preparation
  const departmentData = useMemo(() => {
    const counts = {};
    employees.forEach((emp) => {
      counts[emp.department] = (counts[emp.department] || 0) + 1;
    });
    return Object.keys(counts).map((dept) => ({
      name: dept,
      value: counts[dept]
    }));
  }, [employees]);

  const leaveAnalyticsData = useMemo(() => {
    const counts = {};
    leaveRequests.forEach((req) => {
      counts[req.leaveType] = (counts[req.leaveType] || 0) + 1;
    });
    return Object.keys(counts).map((type) => ({
      name: type,
      value: counts[type]
    }));
  }, [leaveRequests]);

  const attendanceTrendData = [
    { name: "Mon", value: 94 },
    { name: "Tue", value: 92 },
    { name: "Wed", value: 96 },
    { name: "Thu", value: 95 },
    { name: "Fri", value: 92 },
    { name: "Today", value: Math.round((stats.present / (stats.total || 1)) * 100) }
  ];

  const employeeGrowthData = [
    { name: "Jan", value: 2 },
    { name: "Feb", value: 3 },
    { name: "Mar", value: 4 },
    { name: "Apr", value: 5 },
    { name: "May", value: 6 },
    { name: "Jun", value: stats.total }
  ];

  // 3. Widget Lists
  const upcomingHolidays = companyHolidays.filter((h) => new Date(h.date) >= new Date("2026-06-15")).slice(0, 3);

  const pendingApprovals = useMemo(() => {
    return leaveRequests.filter((r) => r.status === "Pending");
  }, [leaveRequests]);

  const recentActivities = useMemo(() => {
    // Compile checked-in logs and recent leave requests
    const activities = [];
    attendanceLogs.slice(0, 4).forEach((log) => {
      const emp = employees.find((e) => e.id === log.employeeId);
      if (emp) {
        activities.push({
          id: log.id,
          title: `${emp.name} clocked in`,
          subtitle: `${log.status} at ${log.checkIn} - ${log.date}`,
          time: "Today"
        });
      }
    });
    return activities.slice(0, 4);
  }, [attendanceLogs, employees]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${currentUser.name} | Executive HR Overview`}
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-7">
        <KPICard title="Total Employees" value={stats.total} icon={<MdPeople />} trend="+4% this month" />
        <KPICard title="Present Today" value={stats.present} icon={<MdCheckCircle />} trend="92% active rate" />
        <KPICard title="Absent Today" value={stats.absent} icon={<MdCancel />} trendType="down" trend="8% absent rate" />
        <KPICard title="On Leave" value={stats.onLeave} icon={<MdEventNote />} trend="2 approved leaves" />
        <KPICard title="New Joiners" value={stats.newJoiners} icon={<MdPersonAdd />} trend="+2 new hires" />
        <KPICard title="Monthly Payroll Cost" value={`$${stats.payrollCost.toLocaleString()}`} icon={<MdAttachMoney />} trend="Within budget" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-7">
        <div className="bg-bg-secondary border border-border-color rounded-lg p-6 shadow-sm">
          <div className="text-base font-bold text-text-primary mb-5 flex items-center justify-between">
            <span>Attendance Trend (%)</span>
            <span className="text-xs text-text-muted font-normal">Last 6 Days</span>
          </div>
          <AreaChartComponent data={attendanceTrendData} xKey="name" yKey="value" color="#2563EB" />
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-lg p-6 shadow-sm">
          <div className="text-base font-bold text-text-primary mb-5 flex items-center justify-between">
            <span>Employee Headcount Growth</span>
            <span className="text-xs text-text-muted font-normal">Cumulative</span>
          </div>
          <BarChartComponent data={employeeGrowthData} xKey="name" yKey="value" color="#10B981" label="Total Staff" />
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-lg p-6 shadow-sm">
          <div className="text-base font-bold text-text-primary mb-5">Department Headcount Distribution</div>
          <PieChartComponent data={departmentData} nameKey="name" valueKey="value" />
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-lg p-6 shadow-sm">
          <div className="text-base font-bold text-text-primary mb-5">Requested Leave Types</div>
          <BarChartComponent data={leaveAnalyticsData} xKey="name" yKey="value" color="#F59E0B" label="Requests" />
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <div className="bg-bg-secondary border border-border-color rounded-lg p-6 shadow-sm flex flex-col h-[380px]">
          <div className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
            <MdHourglassEmpty className="text-amber-500 text-lg" />
            <span>Pending Approvals ({pendingApprovals.length})</span>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            {pendingApprovals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-sm text-text-muted">
                All requests approved!
              </div>
            ) : (
              pendingApprovals.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-2.5 bg-bg-primary rounded-md border border-border-color transition-all hover:border-primary hover:translate-x-0.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-text-primary">{req.employeeName}</span>
                    <span className="text-[10px] text-text-secondary">
                      {req.leaveType} | {req.totalDays} Days ({req.startDate})
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => updateLeaveRequestStatus(req.id, "Approved")}
                      style={{ padding: "6px" }}
                      aria-label="Approve"
                    >
                      <MdCheck />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => updateLeaveRequestStatus(req.id, "Rejected")}
                      style={{ padding: "6px" }}
                      aria-label="Reject"
                    >
                      <MdClose />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Holidays & Events */}
        <div className="bg-bg-secondary border border-border-color rounded-lg p-6 shadow-sm flex flex-col h-[380px]">
          <div className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
            <MdEvent className="text-blue-500 text-lg" />
            <span>Holidays & Events</span>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            {upcomingHolidays.map((holiday) => (
              <div key={holiday.id} className="flex items-center justify-between p-2.5 bg-bg-primary rounded-md border border-border-color transition-all hover:border-primary hover:translate-x-0.5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-text-primary">{holiday.title}</span>
                  <span className="text-[10px] text-text-secondary">Public Holiday</span>
                </div>
                <Badge status="WFH">{new Date(holiday.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</Badge>
              </div>
            ))}
            {companyEvents.slice(0, 1).map((ev) => (
              <div key={ev.id} className="flex items-center justify-between p-2.5 bg-bg-primary rounded-md border border-border-color transition-all hover:border-primary hover:translate-x-0.5 border-l-4 border-l-primary">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-text-primary">{ev.title}</span>
                  <span className="text-[10px] text-text-secondary">{ev.time}</span>
                </div>
                <Badge status="Active">{new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-bg-secondary border border-border-color rounded-lg p-6 shadow-sm flex flex-col h-[380px]">
          <div className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
            <MdSchedule className="text-emerald-500 text-lg" />
            <span>Recent Activities</span>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-center justify-between p-2.5 bg-bg-primary rounded-md border border-border-color transition-all hover:border-primary hover:translate-x-0.5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-text-primary">{act.title}</span>
                  <span className="text-[10px] text-text-secondary">{act.subtitle}</span>
                </div>
                <span className="text-xs text-text-muted font-semibold">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
