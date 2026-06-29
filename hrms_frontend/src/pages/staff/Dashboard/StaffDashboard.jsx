import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { toast } from "react-toastify";
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
import {
  getStaffAttendanceDashboard,
  clockIn as apiClockIn,
  clockOut as apiClockOut,
  breakIn as apiBreakIn,
  breakOut as apiBreakOut,
} from "../../../services/api";

const leaveBalance = [
  { type: "Sick Leave", used: 4, total: 12, color: "#EF4444" },
  { type: "Casual Leave", used: 2, total: 12, color: "#F59E0B" },
  { type: "Paid Leave", used: 8, total: 24, color: "#2563EB" },
];

const fmtTime = (d) => (d ? dayjs(d).format("hh:mm A") : "—");

const StaffDashboard = () => {
  const { currentUser } = useHRMSData();

  const [dashboard, setDashboard] = useState(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const tickRef = useRef(null);

  const today = dashboard?.today || null;
  const shift = dashboard?.shift || null;
  const monthly = dashboard?.monthly || {
    present: 0, late: 0, halfDay: 0, absent: 0, leave: 0, wfh: 0, workedHours: 0,
  };
  const weekly = dashboard?.weekly || [];

  const openBreak = useMemo(() => (today?.breaks || []).find((b) => !b.end), [today]);

  const clockState = useMemo(() => {
    if (!today || !today.clockIn) return "idle";
    if (today.clockOut) return "clocked_out";
    if (openBreak) return "on_break";
    return "clocked_in";
  }, [today, openBreak]);

  const fetchDashboard = async () => {
    try {
      const res = await getStaffAttendanceDashboard();
      if (res.data?.success) setDashboard(res.data.data);
    } catch (err) {
      console.error("Failed to load staff dashboard:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (clockState === "clocked_in" || clockState === "on_break") {
      tickRef.current = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(tickRef.current);
    }
    clearInterval(tickRef.current);
  }, [clockState]);

  const breakMsCompleted = (today?.breaks || []).reduce((acc, b) => {
    if (b.start && b.end) return acc + (new Date(b.end) - new Date(b.start));
    return acc;
  }, 0);
  const breakMsLive =
    breakMsCompleted + (openBreak ? now - new Date(openBreak.start).getTime() : 0);
  const totalBreakMins = Math.floor(breakMsLive / 60000);

  const act = async (fn, okMsg) => {
    setBusy(true);
    try {
      await fn();
      if (okMsg) toast.success(okMsg);
      await fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const handleClockIn = () => act(apiClockIn, "Clocked in");
  const handleClockOut = () => act(apiClockOut, "Clocked out");
  const handleBreakIn = () => act(() => apiBreakIn({ type: "Break" }), "Break started");
  const handleBreakOut = () => act(() => apiBreakOut({}), "Break ended");

  const workHoursData = weekly.map((d) => ({ name: d.name, value: d.value }));
  const totalWorkThisWeek = weekly.reduce((s, d) => s + Number(d.value || 0), 0).toFixed(1);
  const presentThisMonth = monthly.present + monthly.late;

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
                <p className="text-sm font-semibold text-slate-600">{dayjs().format("dddd, DD MMMM YYYY")}</p>
                {shift ? (
                  <p className="text-xs text-slate-400 mt-0.5">{shift.shiftName} ({shift.startTime}–{shift.endTime})</p>
                ) : (
                  <p className="text-xs text-amber-600 mt-0.5 font-semibold">No shift assigned</p>
                )}
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${clockStatusStyle}`}>
                {clockStatusLabel}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Clock In", value: fmtTime(today?.clockIn) },
                { label: "Clock Out", value: fmtTime(today?.clockOut) },
                { label: "Break Duration", value: totalBreakMins > 0 ? `${totalBreakMins} min` : "—" },
                { label: "Break Count", value: (today?.breaks?.length || 0) > 0 ? `${today.breaks.length} break${today.breaks.length > 1 ? "s" : ""}` : "—" },
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
              <button onClick={handleClockIn} disabled={busy} className="flex-1 lg:flex-none px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold uppercase tracking-wide hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20 disabled:opacity-60">
                Clock In
              </button>
            )}
            {clockState === "clocked_in" && (
              <>
                <button onClick={handleBreakIn} disabled={busy} className="flex-1 lg:flex-none px-6 py-3 border-2 border-warning text-warning bg-warning/5 rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-warning/10 active:scale-95 transition-all disabled:opacity-60">
                  Break In
                </button>
                <button onClick={handleClockOut} disabled={busy} className="flex-1 lg:flex-none px-6 py-3 border-2 border-danger text-danger bg-danger/5 rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-danger/10 active:scale-95 transition-all disabled:opacity-60">
                  Clock Out
                </button>
              </>
            )}
            {clockState === "on_break" && (
              <button onClick={handleBreakOut} disabled={busy} className="flex-1 lg:flex-none px-6 py-3 bg-warning text-white rounded-xl text-sm font-bold uppercase tracking-wide hover:opacity-90 active:scale-95 transition-all shadow-md shadow-warning/20 disabled:opacity-60">
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
              { label: "Worked Hours (month)", value: `${monthly.workedHours || 0}h` },
              { label: "This Month Present", value: `${presentThisMonth} days` },
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
        <KPICard title="Days Present (Month)" value={presentThisMonth} icon={<MdCalendarToday />} trend={`${monthly.late || 0} late arrivals`} />
        <KPICard title="Leave Balance" value="26" icon={<MdEventBusy />} trend="Sick · Casual · Paid combined" />
        <KPICard title="KPI Score" value="95%" icon={<MdStarBorder />} trend="+3% from last quarter" />
        <KPICard title="Net Salary (May)" value="₹10,500" icon={<MdAttachMoney />} trend="Payroll processed" />
      </div>

      {/* ── CHARTS / HOLIDAYS ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-7">
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6">
          <div className="text-base font-bold text-slate-800 mb-5 flex items-center justify-between">
            <span>Weekly Work Hours</span>
            <span className="text-xs text-slate-400 font-normal">Last 7 days</span>
          </div>
          <BarChartComponent data={workHoursData} xKey="name" yKey="value" color="#22C55E" label="Work (h)" />
        </div>

        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col">
          <div className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
            <MdEvent className="text-blue-600 text-lg" />
            <span>Upcoming Holidays</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">Next 60 days</p>
          <div className="flex-1 flex flex-col gap-2.5">
            {(dashboard?.upcomingHolidays || []).map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-primary uppercase leading-none">{dayjs(h.holidayDate).format("MMM")}</span>
                    <span className="text-sm font-extrabold text-primary leading-none">{dayjs(h.holidayDate).format("DD")}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{h.holidayName}</p>
                    <p className="text-[10px] text-slate-400">{h.holidayType}</p>
                  </div>
                </div>
                <Badge status="WFH">Holiday</Badge>
              </div>
            ))}
            {(dashboard?.upcomingHolidays || []).length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No upcoming holidays</p>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW WIDGETS ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leave Balance */}
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col">
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Attendance Summary */}
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col">
          <div className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
            <MdSchedule className="text-emerald-500 text-lg" />
            <span>This Month's Attendance</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">{dayjs().format("MMMM YYYY")} summary</p>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Present", value: monthly.present || 0, color: "text-emerald-600" },
              { label: "Late", value: monthly.late || 0, color: "text-amber-600" },
              { label: "Half Day", value: monthly.halfDay || 0, color: "text-orange-600" },
              { label: "Absent", value: monthly.absent || 0, color: "text-rose-600" },
              { label: "On Leave", value: monthly.leave || 0, color: "text-violet-600" },
              { label: "WFH", value: monthly.wfh || 0, color: "text-blue-600" },
            ].map((s) => (
              <div key={s.label} className="border border-slate-100 rounded-xl p-3 bg-slate-50/40 flex flex-col">
                <span className={`text-2xl font-extrabold ${s.color}`}>{s.value}</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
