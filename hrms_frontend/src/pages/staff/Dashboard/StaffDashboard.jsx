import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "../../../components/layouts/PageHeader";
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
  Cell,
} from "recharts";

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

const weeklyData = [
  { day: "Mon", work: 7.8, break: 0.5 },
  { day: "Tue", work: 8.5, break: 1.0 },
  { day: "Wed", work: 4.0, break: 0.5 },
  { day: "Thu", work: 8.3, break: 0.75 },
  { day: "Fri", work: 7.5, break: 0.5 },
  { day: "Sat", work: 0, break: 0 },
  { day: "Today", work: 4.2, break: 0.25 },
];

const recentActivity = [
  { id: 1, title: "Clock In", subtitle: "08:45 AM · On-Time", time: "Today", type: "success" },
  { id: 2, title: "Leave Approved", subtitle: "Casual Leave · Jun 25–26", time: "2 days ago", type: "info" },
  { id: 3, title: "Payroll Processed", subtitle: "May 2026 · ₹10,500 Net", time: "5 days ago", type: "success" },
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

// ── Weekly Chart Tooltip ──────────────────────────────────────────────────────
const WeeklyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
        <p className="font-bold text-slate-700 mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.fill }} />
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

const fmtTime = (d) =>
  d
    ? d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
    : "—";

// ── Component ─────────────────────────────────────────────────────────────────
const StaffDashboard = () => {
  const totalWorkThisWeek = weeklyData.reduce((s, d) => s + d.work, 0).toFixed(1);
  const totalBreakThisWeek = weeklyData.reduce((s, d) => s + d.break, 0).toFixed(1);

  // Attendance state machine: idle → clocked_in ↔ on_break → clocked_out
  const [clockState, setClockState] = useState("idle");
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [breakSessions, setBreakSessions] = useState([]);
  const [currentBreakStart, setCurrentBreakStart] = useState(null);

  const totalBreakMins = breakSessions.reduce((acc, s) => {
    if (s.end) return acc + Math.round((s.end - s.start) / 60000);
    return acc;
  }, 0);

  const handleClockIn = () => {
    setClockInTime(new Date());
    setClockState("clocked_in");
  };
  const handleBreakIn = () => {
    setCurrentBreakStart(new Date());
    setClockState("on_break");
  };
  const handleBreakOut = () => {
    if (currentBreakStart) {
      setBreakSessions((prev) => [...prev, { start: currentBreakStart, end: new Date() }]);
    }
    setCurrentBreakStart(null);
    setClockState("clocked_in");
  };
  const handleClockOut = () => {
    setClockOutTime(new Date());
    setClockState("clocked_out");
  };

  const clockStatusLabel = {
    idle: "Not Started",
    clocked_in: "Clocked In",
    on_break: "On Break",
    clocked_out: "Session Complete",
  }[clockState];

  const clockStatusStyle = {
    idle: "bg-slate-100 text-slate-500",
    clocked_in: "bg-success/10 text-success border border-success/20",
    on_break: "bg-warning/10 text-warning border border-warning/20",
    clocked_out: "bg-slate-100 text-slate-500",
  }[clockState];

  return (
    <div>
      <PageHeader
        title="My Dashboard"
        subtitle={`Welcome back, ${staffProfile.name} · ${staffProfile.designation}`}
      />

      {/* ── TODAY'S ATTENDANCE TRACKER ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-7 bg-white rounded-[24px] border border-slate-100 shadow-[0_12px_45px_rgba(0,0,0,0.04)] p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-6">
          {/* Left — session details */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  Today's Attendance
                </p>
                <p className="text-sm font-semibold text-slate-600">Thursday, 18 June 2026</p>
              </div>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${clockStatusStyle}`}
              >
                {clockStatusLabel}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Clock In", value: fmtTime(clockInTime) },
                { label: "Clock Out", value: fmtTime(clockOutTime) },
                {
                  label: "Break Duration",
                  value: totalBreakMins > 0 ? `${totalBreakMins} min` : "—",
                },
                {
                  label: "Break Count",
                  value:
                    breakSessions.length > 0
                      ? `${breakSessions.length} break${breakSessions.length > 1 ? "s" : ""}`
                      : "—",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border border-slate-100 rounded-xl p-3 bg-slate-50/40"
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm font-bold text-slate-700">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-slate-100" />
          <div className="block lg:hidden h-px bg-slate-100" />

          {/* Right — action buttons */}
          <div className="flex flex-row lg:flex-col gap-3 lg:justify-center lg:min-w-[164px]">
            {clockState === "idle" && (
              <button
                onClick={handleClockIn}
                className="flex-1 lg:flex-none px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold uppercase tracking-wide hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20"
              >
                Clock In
              </button>
            )}

            {clockState === "clocked_in" && (
              <>
                <button
                  onClick={handleBreakIn}
                  className="flex-1 lg:flex-none px-6 py-3 border-2 border-warning text-warning bg-warning/5 rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-warning/10 active:scale-95 transition-all"
                >
                  Break In
                </button>
                <button
                  onClick={handleClockOut}
                  className="flex-1 lg:flex-none px-6 py-3 border-2 border-danger text-danger bg-danger/5 rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-danger/10 active:scale-95 transition-all"
                >
                  Clock Out
                </button>
              </>
            )}

            {clockState === "on_break" && (
              <button
                onClick={handleBreakOut}
                className="flex-1 lg:flex-none px-6 py-3 bg-warning text-white rounded-xl text-sm font-bold uppercase tracking-wide hover:opacity-90 active:scale-95 transition-all shadow-md shadow-warning/20"
              >
                Break Out
              </button>
            )}

            {clockState === "clocked_out" && (
              <div className="flex items-center justify-center py-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                  Day Complete
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── PROFILE SUMMARY BANNER ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
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
              { label: "Work Hours (week)", value: `${totalWorkThisWeek}h` },
              { label: "Break Hours (week)", value: `${totalBreakThisWeek}h` },
              { label: "This Month Present", value: "12 days" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 min-w-[120px] text-center border border-white/10"
              >
                <p className="text-white/60 text-xs mb-1">{item.label}</p>
                <p className="text-white font-bold text-base">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── KPI CARDS ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        {[
          {
            title: "Days Present (Jun)",
            value: "12",
            trend: "On-Time streak: 5 days",
            accent: "border-l-success",
          },
          {
            title: "Leave Balance",
            value: "26",
            trend: "Sick · Casual · Paid combined",
            accent: "border-l-warning",
          },
          {
            title: "KPI Score",
            value: "95%",
            trend: "+3% from last quarter",
            accent: "border-l-info",
          },
          {
            title: "Net Salary (May)",
            value: "₹10,500",
            trend: "Payroll processed",
            accent: "border-l-primary",
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className={`bg-white border border-slate-100 border-l-4 ${card.accent} rounded-[24px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)]`}
          >
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
              {card.title}
            </p>
            <p className="text-3xl font-extrabold text-slate-800 leading-none mb-2">{card.value}</p>
            <p className="text-xs font-semibold text-emerald-600">{card.trend}</p>
          </motion.div>
        ))}
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
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit="h"
              domain={[0, 10]}
            />
            <Tooltip
              content={<WeeklyTooltip />}
              cursor={{ fill: "rgba(241,245,249,0.7)", radius: 8 }}
            />
            <Bar dataKey="work" name="work" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {weeklyData.map((entry, index) => (
                <Cell
                  key={`work-${index}`}
                  fill={entry.work === 0 ? "#e2e8f0" : "#22C55E"}
                  fillOpacity={entry.day === "Today" ? 1 : 0.85}
                />
              ))}
            </Bar>
            <Bar dataKey="break" name="break" radius={[6, 6, 0, 0]} maxBarSize={40}>
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

      {/* ── BOTTOM ROW WIDGETS ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Leave Balance */}
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col h-[370px]">
          <p className="text-base font-bold text-slate-800 mb-1">Leave Balance</p>
          <p className="text-xs text-slate-400 mb-4">FY 2026 entitlements</p>
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
          <button className="mt-4 text-xs text-primary font-bold uppercase tracking-wide hover:text-primary-hover transition-all text-left">
            Apply for Leave →
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col h-[370px]">
          <p className="text-base font-bold text-slate-800 mb-1">Recent Activity</p>
          <p className="text-xs text-slate-400 mb-4">Your latest updates</p>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            {recentActivity.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-blue-500/20 hover:translate-x-0.5 transition-all"
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
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{act.title}</p>
                    <p className="text-[10px] text-slate-400">{act.subtitle}</p>
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
          <p className="text-base font-bold text-slate-800 mb-1">Upcoming Events</p>
          <p className="text-xs text-slate-400 mb-4">Scheduled for this month</p>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            {upcomingEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-blue-500/20 hover:translate-x-0.5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-primary uppercase leading-none">
                      {ev.date.split(" ")[0]}
                    </span>
                    <span className="text-sm font-extrabold text-primary leading-none">
                      {ev.date.split(" ")[1]}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{ev.title}</p>
                    <p className="text-[10px] text-slate-400">{ev.time}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge status={ev.type === "Holiday" ? "WFH" : "Active"}>{ev.type}</Badge>
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
