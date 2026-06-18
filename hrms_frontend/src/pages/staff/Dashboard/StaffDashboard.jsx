import { motion } from "framer-motion";
import PageHeader from "../../../components/layouts/PageHeader";
import KPICard from "../../../components/cards/KPICard";
import Badge from "../../../components/common/Badge";
import Avatar from "../../../components/common/Avatar";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  MdEventBusy,
  MdPayments,
  MdStarBorder,
  MdCheckCircle,
  MdSchedule,
  MdEvent,
  MdCalendarToday,
  MdArrowForward,
  MdAccessTime,
  MdFreeBreakfast,
} from "react-icons/md";

// ── Static Data ───────────────────────────────────────────────────────────────
const staffProfile = {
  name: "Bruce Wayne",
  email: "bruce.w@enterprise-hrms.com",
  designation: "Lead Product Designer",
  department: "Product & Design",
  joiningDate: "2024-06-01",
  avatarColor: "#0F172A",
  status: "Active",
};

// Weekly attendance data — work hours (green) + break hours (red) per day
const weeklyData = [
  { day: "Mon", work: 7.8, break: 0.5 },
  { day: "Tue", work: 8.5, break: 1.0 },
  { day: "Wed", work: 4.0, break: 0.5 },   // half-day
  { day: "Thu", work: 8.3, break: 0.75 },
  { day: "Fri", work: 7.5, break: 0.5 },
  { day: "Sat", work: 0, break: 0 },
  { day: "Today", work: 4.2, break: 0.25 },
];

const netSalaryTrend = [
  { name: "Jan", value: 10400 },
  { name: "Feb", value: 10300 },
  { name: "Mar", value: 10400 },
  { name: "Apr", value: 10500 },
  { name: "May", value: 10500 },
  { name: "Jun", value: 10500 },
];

const recentActivity = [
  { id: 1, title: "Clock In", subtitle: "08:45 AM · On-Time", time: "Today", type: "success" },
  { id: 2, title: "Leave Approved", subtitle: "Casual Leave · Jun 25–26", time: "2 days ago", type: "info" },
  { id: 3, title: "Payroll Processed", subtitle: "May 2026 · $10,500 Net", time: "5 days ago", type: "success" },
  { id: 4, title: "Performance Review", subtitle: "Q2 Review Submitted", time: "1 week ago", type: "warning" },
];

const upcomingEvents = [
  { id: 1, title: "Quarterly Townhall", date: "Jun 18", time: "10:00 AM", type: "Meeting" },
  { id: 2, title: "Design Feedback Review", date: "Jun 23", time: "2:00 PM", type: "Workshop" },
  { id: 3, title: "Juneteenth Holiday", date: "Jun 19", time: "Full Day", type: "Holiday" },
];

const leaveBalance = [
  { type: "Sick Leave", used: 4, total: 12, color: "#EF4444" },
  { type: "Casual Leave", used: 2, total: 12, color: "#F59E0B" },
  { type: "Paid Leave", used: 8, total: 24, color: "#2563EB" },
];

// ── Custom Tooltip for Weekly Chart ─────────────────────────────────────────
const WeeklyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
        <p className="font-bold text-slate-700 mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: p.fill }}
            />
            <span className="text-slate-500 capitalize">{p.name}:</span>
            <span className="font-semibold text-slate-700">{p.value}h</span>
          </div>
        ))}
        <div className="mt-1.5 pt-1.5 border-t border-slate-100">
          <span className="text-slate-400">Total: </span>
          <span className="font-bold text-slate-700">
            {payload.reduce((s, p) => s + p.value, 0).toFixed(2)}h
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// ── Component ─────────────────────────────────────────────────────────────────
const StaffDashboard = () => {
  const totalWorkThisWeek = weeklyData.reduce((s, d) => s + d.work, 0).toFixed(1);
  const totalBreakThisWeek = weeklyData.reduce((s, d) => s + d.break, 0).toFixed(1);

  return (
    <div>
      <PageHeader
        title="My Dashboard"
        subtitle={`Welcome back, ${staffProfile.name} · ${staffProfile.designation}`}
      />

      {/* Profile Summary Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-7 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 rounded-[24px] p-6 text-white shadow-[0_20px_60px_rgba(37,99,235,0.25)] overflow-hidden relative"
      >
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute right-20 bottom-0 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <Avatar name={staffProfile.name} color="#1e40af" size={52} />
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
                Employee Overview
              </p>
              <h2 className="text-xl font-bold">{staffProfile.name}</h2>
              <p className="text-white/70 text-sm">
                {staffProfile.designation} · {staffProfile.department}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Work Hours (week)", value: `${totalWorkThisWeek}h`, icon: <MdAccessTime /> },
              { label: "Break Hours (week)", value: `${totalBreakThisWeek}h`, icon: <MdFreeBreakfast /> },
              { label: "This Month Present", value: "12 days", icon: <MdCheckCircle /> },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 min-w-[120px] text-center border border-white/10"
              >
                <div className="flex items-center justify-center gap-1 text-white/60 text-xs mb-1">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <p className="text-white font-bold text-base">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <KPICard
          title="Days Present (Jun)"
          value="12"
          icon={<MdCheckCircle />}
          trend="On-Time streak: 5 days"
        />
        <KPICard
          title="Leave Balance"
          value="26"
          icon={<MdEventBusy />}
          trend="Sick · Casual · Paid combined"
        />
        <KPICard
          title="KPI Score"
          value="95%"
          icon={<MdStarBorder />}
          trend="+3% from last quarter"
        />
        <KPICard
          title="Net Salary (May)"
          value="$10,500"
          icon={<MdPayments />}
          trend="Payroll processed"
        />
      </div>

      {/* ── WEEKLY ATTENDANCE CHART ─────────────────────────────────────────── */}
      <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6 mb-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-800">Weekly Attendance Overview</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Jun 12–18, 2026 · Green = Work hours · Red = Break hours
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#22C55E]" />
              <span className="text-xs text-slate-500 font-medium">Work Time</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#EF4444]" />
              <span className="text-xs text-slate-500 font-medium">Break Time</span>
            </div>
          </div>
        </div>

        {/* Summary Pills */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2 bg-success/10 border border-success/20 rounded-lg px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs font-semibold text-success">
              Total Work: {totalWorkThisWeek}h this week
            </span>
          </div>
          <div className="flex items-center gap-2 bg-danger/10 border border-danger/20 rounded-lg px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-danger" />
            <span className="text-xs font-semibold text-danger">
              Total Break: {totalBreakThisWeek}h this week
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={weeklyData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barCategoryGap="30%"
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit="h"
              domain={[0, 10]}
            />
            <Tooltip content={<WeeklyTooltip />} cursor={{ fill: "rgba(241,245,249,0.7)", radius: 8 }} />
            <Bar
              dataKey="work"
              name="work"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            >
              {weeklyData.map((entry, index) => (
                <Cell
                  key={`work-${index}`}
                  fill={entry.work === 0 ? "#e2e8f0" : "#22C55E"}
                  fillOpacity={entry.day === "Today" ? 1 : 0.85}
                />
              ))}
            </Bar>
            <Bar
              dataKey="break"
              name="break"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            >
              {weeklyData.map((entry, index) => (
                <Cell
                  key={`break-${index}`}
                  fill={entry.break === 0 ? "#e2e8f0" : "#EF4444"}
                  fillOpacity={entry.day === "Today" ? 1 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Per-day summary row */}
        <div className="grid grid-cols-7 gap-1 mt-4 border-t border-slate-100 pt-4">
          {weeklyData.map((d) => (
            <div key={d.day} className="text-center">
              <p className="text-[10px] font-bold text-slate-500 mb-1">{d.day}</p>
              {d.work > 0 ? (
                <>
                  <p className="text-[9px] font-semibold text-success">{d.work}h</p>
                  <p className="text-[9px] text-danger">{d.break}h brk</p>
                </>
              ) : (
                <p className="text-[9px] text-slate-300">—</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Leave Balance */}
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col h-[370px]">
          <div className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MdEventBusy className="text-amber-500 text-lg" />
            <span>Leave Balance</span>
          </div>
          <div className="flex-1 flex flex-col gap-5 justify-center">
            {leaveBalance.map((leave) => {
              const remaining = leave.total - leave.used;
              const pct = Math.round((leave.used / leave.total) * 100);
              return (
                <div key={leave.type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-700">{leave.type}</span>
                    <span className="text-xs text-slate-400">
                      <span className="font-bold text-slate-700">{remaining}</span> / {leave.total} left
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: leave.color }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-slate-400">{leave.used} used</span>
                    <span className="text-[10px] text-slate-400">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="mt-4 flex items-center gap-1.5 text-xs text-primary font-semibold hover:gap-2.5 transition-all">
            Apply for Leave <MdArrowForward />
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col h-[370px]">
          <div className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MdSchedule className="text-emerald-500 text-lg" />
            <span>Recent Activity</span>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            {recentActivity.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 transition-all hover:border-blue-500/20 hover:translate-x-0.5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      act.type === "success"
                        ? "bg-success"
                        : act.type === "info"
                        ? "bg-info"
                        : "bg-warning"
                    }`}
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-slate-700">{act.title}</span>
                    <span className="text-[10px] text-slate-400">{act.subtitle}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-semibold whitespace-nowrap ml-2">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col h-[370px]">
          <div className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MdEvent className="text-blue-600 text-lg" />
            <span>Upcoming Events</span>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            {upcomingEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100 transition-all hover:border-blue-500/20 hover:translate-x-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <MdCalendarToday className="text-base" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-slate-700">{ev.title}</span>
                    <span className="text-[10px] text-slate-400">{ev.time}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge status={ev.type === "Holiday" ? "WFH" : "Active"}>{ev.date}</Badge>
                  <span className="text-[10px] text-slate-400">{ev.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
