import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "../../../components/layouts/PageHeader";
import KPICard from "../../../components/cards/KPICard";
import { BarChartComponent } from "../../../components/charts/ChartWrappers";
import Badge from "../../../components/common/Badge";
import Avatar from "../../../components/common/Avatar";
import {
  MdCalendarToday,
  MdEventBusy,
  MdStarBorder,
  MdAttachMoney,
  MdSchedule,
  MdEvent,
} from "react-icons/md";
import { useHRMSData } from "../../../context/HRMSDataContext";

// ── Static Data ───────────────────────────────────────────────────────────────
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

const fmtTime = (d) =>
  d
    ? d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
    : "—";

// ── Component ─────────────────────────────────────────────────────────────────
const StaffDashboard = () => {
  const { currentUser } = useHRMSData();

  const totalWorkThisWeek = weeklyData.reduce((s, d) => s + d.work, 0).toFixed(1);
  const totalBreakThisWeek = weeklyData.reduce((s, d) => s + d.break, 0).toFixed(1);

  const workHoursData = weeklyData.map((d) => ({ name: d.day, value: d.work }));
  const breakHoursData = weeklyData.map((d) => ({ name: d.day, value: d.break }));

  const [clockState, setClockState] = useState("idle");
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [breakSessions, setBreakSessions] = useState([]);
  const [currentBreakStart, setCurrentBreakStart] = useState(null);

  const totalBreakMins = breakSessions.reduce((acc, s) => {
    if (s.end) return acc + Math.round((s.end - s.start) / 60000);
    return acc;
  }, 0);

  const handleClockIn = () => { setClockInTime(new Date()); setClockState("clocked_in"); };
  const handleBreakIn = () => { setCurrentBreakStart(new Date()); setClockState("on_break"); };
  const handleBreakOut = () => {
    if (currentBreakStart) {
      setBreakSessions((prev) => [...prev, { start: currentBreakStart, end: new Date() }]);
    }
    setCurrentBreakStart(null);
    setClockState("clocked_in");
  };
  const handleClockOut = () => { setClockOutTime(new Date()); setClockState("clocked_out"); };

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
        subtitle={`Welcome back, ${currentUser.name || "Employee"} · Employee Portal`}
      />

      {/* ── TODAY'S ATTENDANCE TRACKER ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-7 bg-white rounded-[24px] border border-slate-100 shadow-[0_12px_45px_rgba(0,0,0,0.04)] p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-6">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  Today's Attendance
                </p>
                <p className="text-sm font-semibold text-slate-600">Thursday, 18 June 2026</p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${clockStatusStyle}`}>
                {clockStatusLabel}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Clock In", value: fmtTime(clockInTime) },
                { label: "Clock Out", value: fmtTime(clockOutTime) },
                { label: "Break Duration", value: totalBreakMins > 0 ? `${totalBreakMins} min` : "—" },
                { label: "Break Count", value: breakSessions.length > 0 ? `${breakSessions.length} break${breakSessions.length > 1 ? "s" : ""}` : "—" },
              ].map((item) => (
                <div key={item.label} className="border border-slate-100 rounded-xl p-3 bg-slate-50/40">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-slate-700">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block w-px bg-slate-100" />
          <div className="block lg:hidden h-px bg-slate-100" />

          <div className="flex flex-row lg:flex-col gap-3 lg:justify-center lg:min-w-[164px]">
            {clockState === "idle" && (
              <button onClick={handleClockIn} className="flex-1 lg:flex-none px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold uppercase tracking-wide hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20">
                Clock In
              </button>
            )}
            {clockState === "clocked_in" && (
              <>
                <button onClick={handleBreakIn} className="flex-1 lg:flex-none px-6 py-3 border-2 border-warning text-warning bg-warning/5 rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-warning/10 active:scale-95 transition-all">
                  Break In
                </button>
                <button onClick={handleClockOut} className="flex-1 lg:flex-none px-6 py-3 border-2 border-danger text-danger bg-danger/5 rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-danger/10 active:scale-95 transition-all">
                  Clock Out
                </button>
              </>
            )}
            {clockState === "on_break" && (
              <button onClick={handleBreakOut} className="flex-1 lg:flex-none px-6 py-3 bg-warning text-white rounded-xl text-sm font-bold uppercase tracking-wide hover:opacity-90 active:scale-95 transition-all shadow-md shadow-warning/20">
                Break Out
              </button>
            )}
            {clockState === "clocked_out" && (
              <div className="flex items-center justify-center py-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Day Complete</p>
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
            <Avatar name={currentUser.name || "E"} color="#1e40af" size={52} />
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">Employee Overview</p>
              <h2 className="text-xl font-bold">{currentUser.name || "Employee"}</h2>
              <p className="text-white/70 text-sm">{currentUser.role || "Staff"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Work Hours (week)", value: `${totalWorkThisWeek}h` },
              { label: "Break Hours (week)", value: `${totalBreakThisWeek}h` },
              { label: "This Month Present", value: "12 days" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 min-w-[120px] text-center border border-white/10">
                <p className="text-white/60 text-xs mb-1">{item.label}</p>
                <p className="text-white font-bold text-base">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── KPI CARDS ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <KPICard title="Days Present (Jun)" value="12" icon={<MdCalendarToday />} trend="On-Time streak: 5 days" />
        <KPICard title="Leave Balance" value="26" icon={<MdEventBusy />} trend="Sick · Casual · Paid combined" />
        <KPICard title="KPI Score" value="95%" icon={<MdStarBorder />} trend="+3% from last quarter" />
        <KPICard title="Net Salary (May)" value="₹10,500" icon={<MdAttachMoney />} trend="Payroll processed" />
      </div>

      {/* ── CHARTS ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-7">
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6">
          <div className="text-base font-bold text-slate-800 mb-5 flex items-center justify-between">
            <span>Weekly Work Hours</span>
            <span className="text-xs text-slate-400 font-normal">Jun 12–18, 2026</span>
          </div>
          <BarChartComponent data={workHoursData} xKey="name" yKey="value" color="#22C55E" label="Work (h)" />
        </div>

        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6">
          <div className="text-base font-bold text-slate-800 mb-5 flex items-center justify-between">
            <span>Weekly Break Hours</span>
            <span className="text-xs text-slate-400 font-normal">Jun 12–18, 2026</span>
          </div>
          <BarChartComponent data={breakHoursData} xKey="name" yKey="value" color="#F59E0B" label="Break (h)" />
        </div>
      </div>

      {/* ── BOTTOM ROW WIDGETS ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Leave Balance */}
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col h-[370px]">
          <div className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
            <MdEventBusy className="text-amber-500 text-lg" />
            <span>Leave Balance</span>
          </div>
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
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: leave.color }} />
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
          <div className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
            <MdSchedule className="text-emerald-500 text-lg" />
            <span>Recent Activity</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">Your latest updates</p>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            {recentActivity.map((act) => (
              <div key={act.id} className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-blue-500/20 hover:translate-x-0.5 transition-all">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${act.type === "success" ? "bg-success" : act.type === "info" ? "bg-info" : "bg-warning"}`} />
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{act.title}</p>
                    <p className="text-[10px] text-slate-400">{act.subtitle}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-semibold whitespace-nowrap ml-2">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col h-[370px]">
          <div className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
            <MdEvent className="text-blue-600 text-lg" />
            <span>Upcoming Events</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">Scheduled for this month</p>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-blue-500/20 hover:translate-x-0.5 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-primary uppercase leading-none">{ev.date.split(" ")[0]}</span>
                    <span className="text-sm font-extrabold text-primary leading-none">{ev.date.split(" ")[1]}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{ev.title}</p>
                    <p className="text-[10px] text-slate-400">{ev.time}</p>
                  </div>
                </div>
                <Badge status={ev.type === "Holiday" ? "WFH" : "Active"}>{ev.type}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
