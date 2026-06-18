import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logowhite.png";
import {
  MdDashboard,
  MdAccessTime,
  MdEventBusy,
  MdPayments,
  MdStarBorder,
  MdPerson,
  MdCalendarToday,
  MdMenuOpen,
  MdMenu,
  MdFingerprint,
  MdFreeBreakfast,
  MdPlayArrow,
  MdStop,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (d) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
const fmtDate = (d) =>
  d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const fmtDuration = (ms) => {
  if (!ms || ms < 0) return "0m";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// Build a key like "2026-06-18"
const dayKey = (d) => d.toISOString().split("T")[0];

// ── Clock Panel Component ─────────────────────────────────────────────────────
const ClockPanel = ({ isCollapsed }) => {
  const [now, setNow] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  // Each day entry: { clockIn, clockOut, breaks: [{in, out}] }
  const [logs, setLogs] = useState({});

  const [status, setStatus] = useState("idle"); // idle | working | break

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const todayKey = dayKey(new Date());
  const viewKey = dayKey(viewDate);
  const todayLog = logs[viewKey] || { clockIn: null, clockOut: null, breaks: [] };
  const isToday = viewKey === todayKey;

  // ── Actions (only operative for today) ──────────────────────────────────
  const handleClockIn = () => {
    if (!isToday || status !== "idle") return;
    setLogs((prev) => ({
      ...prev,
      [todayKey]: { clockIn: new Date(), clockOut: null, breaks: [] },
    }));
    setStatus("working");
  };

  const handleBreakIn = () => {
    if (!isToday || status !== "working") return;
    setLogs((prev) => {
      const entry = prev[todayKey] || { clockIn: null, clockOut: null, breaks: [] };
      return {
        ...prev,
        [todayKey]: {
          ...entry,
          breaks: [...entry.breaks, { in: new Date(), out: null }],
        },
      };
    });
    setStatus("break");
  };

  const handleBreakOut = () => {
    if (!isToday || status !== "break") return;
    setLogs((prev) => {
      const entry = prev[todayKey];
      const breaks = entry.breaks.map((b, i) =>
        i === entry.breaks.length - 1 && !b.out ? { ...b, out: new Date() } : b
      );
      return { ...prev, [todayKey]: { ...entry, breaks } };
    });
    setStatus("working");
  };

  const handleClockOut = () => {
    if (!isToday || status !== "working") return;
    setLogs((prev) => {
      const entry = prev[todayKey];
      return { ...prev, [todayKey]: { ...entry, clockOut: new Date() } };
    });
    setStatus("idle");
  };

  // ── Duration calculations ──────────────────────────────────────────────
  const totalBreakMs = todayLog.breaks.reduce((sum, b) => {
    const end = b.out || (isToday && status === "break" ? now : null);
    return sum + (b.in && end ? end - b.in : 0);
  }, 0);

  const totalWorkMs = (() => {
    if (!todayLog.clockIn) return 0;
    const end = todayLog.clockOut || (isToday ? now : null);
    if (!end) return 0;
    return Math.max(0, end - todayLog.clockIn - totalBreakMs);
  })();

  // ── Status chip ────────────────────────────────────────────────────────
  const statusChip = {
    idle: { label: "Not Clocked In", color: "bg-slate-200 text-slate-500" },
    working: { label: "Working", color: "bg-success/20 text-success" },
    break: { label: "On Break", color: "bg-warning/20 text-warning" },
  }[status];

  if (isCollapsed) return null;

  return (
    <div className="mx-3 mb-3 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 border-b border-white/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
            Attendance
          </span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusChip.color}`}>
            {statusChip.label}
          </span>
        </div>
        {/* Date Navigator */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              const d = new Date(viewDate);
              d.setDate(d.getDate() - 1);
              setViewDate(d);
            }}
            className="text-white/40 hover:text-white p-0.5 rounded transition-all"
          >
            <MdChevronLeft className="text-sm" />
          </button>
          <span className="text-[11px] font-semibold text-white/70">
            {isToday ? "Today" : fmtDate(viewDate)}
          </span>
          <button
            onClick={() => {
              const d = new Date(viewDate);
              d.setDate(d.getDate() + 1);
              if (d <= new Date()) setViewDate(d);
            }}
            className="text-white/40 hover:text-white p-0.5 rounded transition-all disabled:opacity-30"
            disabled={isToday}
          >
            <MdChevronRight className="text-sm" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-px bg-white/5 border-b border-white/10">
        {[
          {
            label: "Work Time",
            value: todayLog.clockIn ? fmtDuration(totalWorkMs) : "—",
            color: "text-success",
          },
          {
            label: "Break Time",
            value: todayLog.breaks.length ? fmtDuration(totalBreakMs) : "—",
            color: "text-warning",
          },
        ].map((s) => (
          <div key={s.label} className="bg-white/3 px-2 py-2 text-center">
            <p className={`text-xs font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Clock In / Out + Break times */}
      {todayLog.clockIn && (
        <div className="px-3 py-2 space-y-1 border-b border-white/10">
          <div className="flex justify-between text-[10px]">
            <span className="text-white/40">Clock In</span>
            <span className="text-success font-semibold">{fmt(todayLog.clockIn)}</span>
          </div>
          {todayLog.breaks.map((b, i) => (
            <div key={i} className="flex justify-between text-[10px]">
              <span className="text-white/40">Break {i + 1}</span>
              <span className="text-warning font-semibold">
                {fmt(b.in)} – {b.out ? fmt(b.out) : "ongoing"}
              </span>
            </div>
          ))}
          {todayLog.clockOut && (
            <div className="flex justify-between text-[10px]">
              <span className="text-white/40">Clock Out</span>
              <span className="text-danger font-semibold">{fmt(todayLog.clockOut)}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons — only for today */}
      {isToday && (
        <div className="p-2 flex flex-col gap-1.5">
          {status === "idle" && (
            <button
              onClick={handleClockIn}
              id="sidebar-clock-in-btn"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-success/20 hover:bg-success/30 text-success text-xs font-bold transition-all"
            >
              <MdPlayArrow className="text-sm" /> Clock In
            </button>
          )}
          {status === "working" && (
            <>
              <button
                onClick={handleBreakIn}
                id="sidebar-break-in-btn"
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-warning/20 hover:bg-warning/30 text-warning text-xs font-bold transition-all"
              >
                <MdFreeBreakfast className="text-sm" /> Break In
              </button>
              <button
                onClick={handleClockOut}
                id="sidebar-clock-out-btn"
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-danger/20 hover:bg-danger/30 text-danger text-xs font-bold transition-all"
              >
                <MdStop className="text-sm" /> Clock Out
              </button>
            </>
          )}
          {status === "break" && (
            <button
              onClick={handleBreakOut}
              id="sidebar-break-out-btn"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-success/20 hover:bg-success/30 text-success text-xs font-bold transition-all"
            >
              <MdFingerprint className="text-sm" /> Break Out
            </button>
          )}
        </div>
      )}

      {/* View-only past day notice */}
      {!isToday && (
        <div className="px-3 py-2 text-center text-[9px] text-white/30">
          {todayLog.clockIn
            ? "Past attendance record"
            : "No record for this day"}
        </div>
      )}
    </div>
  );
};

// ── Main Sidebar ──────────────────────────────────────────────────────────────
const StaffSidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const menuItems = [
    { name: "Dashboard", path: "/staff/dashboard", icon: <MdDashboard /> },
    { name: "My Attendance", path: "/staff/attendance", icon: <MdAccessTime /> },
    { name: "My Leave", path: "/staff/leave", icon: <MdEventBusy /> },
    { name: "My Payroll", path: "/staff/payroll", icon: <MdPayments /> },
    { name: "My Performance", path: "/staff/performance", icon: <MdStarBorder /> },
    { name: "My Profile", path: "/staff/profile", icon: <MdPerson /> },
    { name: "Calendar", path: "/staff/calendar", icon: <MdCalendarToday /> },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-bg-sidebar text-gray-400 flex flex-col border-r border-border-color z-50 shadow-lg transition-all duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "w-[72px]" : "w-[260px]"}`}
      >
        {/* Logo */}
        <div className="h-[70px] flex items-center justify-center px-6 border-b border-white/10 shrink-0">
          <img src={logo} alt="HRMS Logo" className="h-22 w-auto object-contain" />
        </div>

        {/* Employee Portal badge */}
        {!isCollapsed && (
          <div className="mx-3 mt-3 mb-1 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Employee Portal
            </span>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg hover:bg-bg-sidebar-hover hover:text-white transition-all text-sm font-medium gap-3 whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.3)]"
                    : "text-gray-400"
                }`
              }
              onClick={() => setIsMobileOpen(false)}
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              <span
                className={`transition-opacity duration-300 ${
                  isCollapsed
                    ? "opacity-0 w-0 overflow-hidden pointer-events-none"
                    : "opacity-100"
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* ── Clock Panel ── */}
        <ClockPanel isCollapsed={isCollapsed} />

        {/* Collapse toggle */}
        <div className="px-4 pb-4 border-t border-white/5 pt-3 flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:bg-bg-sidebar-hover hover:text-white text-xl p-2 rounded-full w-9 h-9 flex items-center justify-center transition-all hidden md:flex"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <MdMenu /> : <MdMenuOpen />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default StaffSidebar;
