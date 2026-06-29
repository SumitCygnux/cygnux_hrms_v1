import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import PageHeader from "../../../components/layouts/PageHeader";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import KPICard from "../../../components/cards/KPICard";
import DetailModal from "../../../components/modals/DetailModal";
import { BarChartComponent } from "../../../components/charts/ChartWrappers";
import {
  MdCheckCircle,
  MdSchedule,
  MdHome,
  MdCancel,
  MdLogin,
  MdLogout,
  MdFreeBreakfast,
  MdPlayArrow,
  MdAdd,
  MdEvent,
} from "react-icons/md";
import {
  getStaffAttendanceDashboard,
  getAttendanceHistory,
  getMyAttendanceRequests,
  clockIn as apiClockIn,
  clockOut as apiClockOut,
  breakIn as apiBreakIn,
  breakOut as apiBreakOut,
  createMyAttendanceRequest,
} from "../../../services/api";

const BREAK_TYPES = ["Lunch", "Tea", "Personal", "Other"];
const REQUEST_TYPES = [
  "Regularization",
  "Missed Punch",
  "Attendance Correction",
  "Work From Home",
  "On Duty",
];

const fmtTime = (d) => (d ? dayjs(d).format("hh:mm A") : "—");

const fmtDuration = (ms) => {
  if (!ms || ms < 0) ms = 0;
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const StaffAttendance = () => {
  const [dashboard, setDashboard] = useState(null);
  const [logs, setLogs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Present", "Late", "Absent", "Half Day", "On Leave", "Work From Home"];

  // Break modal
  const [breakModal, setBreakModal] = useState(false);
  const [breakType, setBreakType] = useState("Lunch");
  const [breakRemarks, setBreakRemarks] = useState("");

  // Request modal
  const [reqModal, setReqModal] = useState(false);
  const [reqForm, setReqForm] = useState({
    requestType: "Regularization",
    requestDate: dayjs().format("YYYY-MM-DD"),
    reason: "",
    clockIn: "",
    clockOut: "",
  });

  const tickRef = useRef(null);

  const today = dashboard?.today || null;
  const shift = dashboard?.shift || null;

  const openBreak = useMemo(() => (today?.breaks || []).find((b) => !b.end), [today]);

  const clockState = useMemo(() => {
    if (!today || !today.clockIn) return "idle";
    if (today.clockOut) return "clocked_out";
    if (openBreak) return "on_break";
    return "clocked_in";
  }, [today, openBreak]);

  // Live ticking only while a session is active.
  useEffect(() => {
    if (clockState === "clocked_in" || clockState === "on_break") {
      tickRef.current = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(tickRef.current);
    }
    clearInterval(tickRef.current);
  }, [clockState]);

  const fetchAll = async () => {
    try {
      const [dashRes, histRes, reqRes] = await Promise.all([
        getStaffAttendanceDashboard(),
        getAttendanceHistory(),
        getMyAttendanceRequests(),
      ]);
      if (dashRes.data?.success) setDashboard(dashRes.data.data);
      if (histRes.data?.success) setLogs(histRes.data.data || []);
      if (reqRes.data?.success) setRequests(reqRes.data.data || []);
    } catch (err) {
      console.error("Failed to load attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ── Live durations ───────────────────────────────────────────────────────
  const breakMsCompleted = (today?.breaks || []).reduce((acc, b) => {
    if (b.start && b.end) return acc + (new Date(b.end) - new Date(b.start));
    return acc;
  }, 0);
  const breakMsLive =
    breakMsCompleted + (openBreak ? now - new Date(openBreak.start).getTime() : 0);
  const workedMsLive =
    today?.clockIn && !today?.clockOut
      ? Math.max(0, now - new Date(today.clockIn).getTime() - breakMsLive)
      : Number(today?.workingHours || 0) * 3600000;

  // ── Actions ──────────────────────────────────────────────────────────────
  const act = async (fn, okMsg) => {
    setBusy(true);
    try {
      await fn();
      if (okMsg) toast.success(okMsg);
      await fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const handleClockIn = () => act(apiClockIn, "Clocked in");
  const handleClockOut = () => act(apiClockOut, "Clocked out");
  const handleEndBreak = () => act(() => apiBreakOut({}), "Break ended");
  const handleStartBreak = async () => {
    setBreakModal(false);
    await act(() => apiBreakIn({ type: breakType, remarks: breakRemarks }), "Break started");
    setBreakRemarks("");
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    const payload = {};
    if (reqForm.clockIn) payload.clockIn = `${reqForm.requestDate}T${reqForm.clockIn}:00`;
    if (reqForm.clockOut) payload.clockOut = `${reqForm.requestDate}T${reqForm.clockOut}:00`;
    if (reqForm.requestType === "Work From Home") payload.status = "Work From Home";
    if (reqForm.requestType === "On Duty") payload.status = "On Duty";
    await act(
      () =>
        createMyAttendanceRequest({
          requestType: reqForm.requestType,
          requestDate: reqForm.requestDate,
          reason: reqForm.reason,
          payload: Object.keys(payload).length ? payload : null,
        }),
      "Request submitted"
    );
    setReqModal(false);
    setReqForm({
      requestType: "Regularization",
      requestDate: dayjs().format("YYYY-MM-DD"),
      reason: "",
      clockIn: "",
      clockOut: "",
    });
  };

  const monthly = dashboard?.monthly || {
    present: 0, late: 0, halfDay: 0, absent: 0, leave: 0, wfh: 0, workedHours: 0,
  };
  const weekly = dashboard?.weekly || [];

  const filtered =
    activeFilter === "All" ? logs : logs.filter((l) => l.status === activeFilter);

  const statusLabel = {
    idle: "Not Started",
    clocked_in: "Working",
    on_break: "On Break",
    clocked_out: "Day Complete",
  }[clockState];

  const statusStyle = {
    idle: "bg-slate-100 text-slate-500",
    clocked_in: "bg-success/10 text-success border border-success/20",
    on_break: "bg-warning/10 text-warning border border-warning/20",
    clocked_out: "bg-slate-100 text-slate-500",
  }[clockState];

  if (loading) {
    return (
      <div>
        <PageHeader title="My Attendance" subtitle="Track your daily check-in / check-out records" />
        <div className="py-16 text-center text-slate-400">Loading attendance…</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Attendance"
        subtitle="Live clock-in / out, breaks, and your attendance history"
      />

      {/* ── LIVE TRACKER ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7 bg-white rounded-[24px] border border-slate-100 shadow-[0_12px_45px_rgba(0,0,0,0.04)] p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-6">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  Today's Attendance
                </p>
                <p className="text-sm font-semibold text-slate-600">
                  {dayjs().format("dddd, DD MMMM YYYY")}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {shift ? (
                    <span className="text-xs text-slate-500">
                      <span className="font-bold text-slate-700">{shift.shiftName}</span>{" "}
                      ({shift.startTime}–{shift.endTime})
                    </span>
                  ) : (
                    <span className="text-xs text-amber-600 font-semibold">No shift assigned</span>
                  )}
                  {dashboard?.isHolidayToday && <Badge status="WFH">Holiday</Badge>}
                  {dashboard?.isWeeklyOffToday && <Badge status="WFH">Weekly Off</Badge>}
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${statusStyle}`}>
                {statusLabel}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Clock In", value: fmtTime(today?.clockIn) },
                { label: "Clock Out", value: fmtTime(today?.clockOut) },
                { label: "Worked", value: fmtDuration(workedMsLive) },
                { label: "Break", value: fmtDuration(breakMsLive) },
              ].map((item) => (
                <div key={item.label} className="border border-slate-100 rounded-xl p-3 bg-slate-50/40">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-slate-700 tabular-nums">{item.value}</p>
                </div>
              ))}
            </div>

            {today && (
              <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400 flex-wrap">
                {today.status && (
                  <span className="flex items-center gap-1">Status: <Badge status={today.status}>{today.status}</Badge></span>
                )}
                {today.lateMinutes > 0 && <span className="text-rose-500 font-semibold">Late {today.lateMinutes}m</span>}
                {today.overtimeMinutes > 0 && <span className="text-emerald-600 font-semibold">OT {today.overtimeMinutes}m</span>}
                {today.clockOutApproval === "Pending" && <Badge status="Pending">Clock-out pending approval</Badge>}
              </div>
            )}
          </div>

          <div className="hidden lg:block w-px bg-slate-100" />
          <div className="block lg:hidden h-px bg-slate-100" />

          <div className="flex flex-row lg:flex-col gap-3 lg:justify-center lg:min-w-[180px]">
            {clockState === "idle" && (
              <Button variant="primary" size="lg" className="flex-1" disabled={busy} onClick={handleClockIn} iconBefore={<MdLogin />}>
                Clock In
              </Button>
            )}
            {clockState === "clocked_in" && (
              <>
                <Button variant="warning" className="flex-1" disabled={busy} onClick={() => setBreakModal(true)} iconBefore={<MdFreeBreakfast />}>
                  Break In
                </Button>
                <Button variant="danger" className="flex-1" disabled={busy} onClick={handleClockOut} iconBefore={<MdLogout />}>
                  Clock Out
                </Button>
              </>
            )}
            {clockState === "on_break" && (
              <Button variant="success" size="lg" className="flex-1" disabled={busy} onClick={handleEndBreak} iconBefore={<MdPlayArrow />}>
                End Break
              </Button>
            )}
            {clockState === "clocked_out" && (
              <div className="flex-1 flex items-center justify-center py-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Day Complete</p>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => setReqModal(true)} iconBefore={<MdAdd />}>
              Request
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ── KPI CARDS (this month) ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <KPICard title="Present (This Month)" value={monthly.present + monthly.late} icon={<MdCheckCircle />} color="emerald" variant="clean" trend={`${monthly.workedHours}h worked`} />
        <KPICard title="Late Arrivals" value={monthly.late} icon={<MdSchedule />} color="amber" variant="clean" trendType="down" trend="After grace period" />
        <KPICard title="WFH Days" value={monthly.wfh} icon={<MdHome />} color="blue" variant="clean" trend="Work from home" />
        <KPICard title="Absent Days" value={monthly.absent} icon={<MdCancel />} color="rose" variant="clean" trendType="down" trend="No attendance" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-7">
        {/* Weekly hours chart */}
        <div className="xl:col-span-2 bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-bold text-slate-800">Hours Logged This Week</span>
            <span className="text-xs text-slate-400">Last 7 days</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">Your daily working hours</p>
          <BarChartComponent data={weekly} xKey="name" yKey="value" color="#2563EB" label="Hours" />
        </div>

        {/* Upcoming holidays */}
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col">
          <div className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
            <MdEvent className="text-blue-600 text-lg" />
            <span>Upcoming Holidays</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">Next 60 days</p>
          <div className="flex-1 flex flex-col gap-2.5">
            {(dashboard?.upcomingHolidays || []).map((h) => (
              <div key={h.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
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
              </div>
            ))}
            {(dashboard?.upcomingHolidays || []).length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No upcoming holidays</p>
            )}
          </div>
        </div>
      </div>

      {/* ── MY REQUESTS ───────────────────────────────────────────────────── */}
      {requests.length > 0 && (
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6 mb-7">
          <p className="text-base font-bold text-slate-800 mb-4">My Requests</p>
          <div className="flex flex-col gap-2">
            {requests.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div>
                  <p className="text-xs font-semibold text-slate-700">{r.requestType} · {r.requestDate}</p>
                  <p className="text-[11px] text-slate-400">{r.reason}</p>
                </div>
                <Badge status={r.status}>{r.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HISTORY TABLE ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-base font-bold text-slate-800">Attendance Log</p>
            <p className="text-xs text-slate-400 mt-0.5">{filtered.length} records</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === f
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Date", "Clock In", "Clock Out", "Hours", "Break", "Late", "Overtime", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, idx) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5 text-slate-700 font-medium">{log.date}</td>
                  <td className="px-5 py-3.5 text-slate-600">{log.clockIn ? fmtTime(log.clockIn) : "—"}</td>
                  <td className="px-5 py-3.5 text-slate-600">{log.clockOut ? fmtTime(log.clockOut) : "—"}</td>
                  <td className="px-5 py-3.5 text-slate-700 font-semibold">{Number(log.workingHours || 0)}h</td>
                  <td className="px-5 py-3.5 text-slate-600">{log.breakDuration || 0}m</td>
                  <td className="px-5 py-3.5 text-slate-600">{log.lateMinutes > 0 ? <span className="text-rose-500 font-semibold">{log.lateMinutes}m</span> : "—"}</td>
                  <td className="px-5 py-3.5 text-slate-600">{log.overtimeMinutes > 0 ? <span className="text-emerald-600 font-semibold">+{log.overtimeMinutes}m</span> : "—"}</td>
                  <td className="px-5 py-3.5"><Badge status={log.status}>{log.status}</Badge></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-10 text-center text-slate-400 text-sm">No records found</div>
          )}
        </div>
      </div>

      {/* ── BREAK MODAL ───────────────────────────────────────────────────── */}
      <DetailModal isOpen={breakModal} onClose={() => setBreakModal(false)} title="Start Break" maxWidth="420px">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-secondary">Break Type</label>
            <select
              value={breakType}
              onChange={(e) => setBreakType(e.target.value)}
              className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
            >
              {BREAK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-secondary">Remarks (optional)</label>
            <input
              type="text"
              value={breakRemarks}
              onChange={(e) => setBreakRemarks(e.target.value)}
              placeholder="e.g. Lunch with team"
              className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setBreakModal(false)}>Cancel</Button>
            <Button variant="warning" onClick={handleStartBreak} disabled={busy}>Start Break</Button>
          </div>
        </div>
      </DetailModal>

      {/* ── REQUEST MODAL ─────────────────────────────────────────────────── */}
      <DetailModal isOpen={reqModal} onClose={() => setReqModal(false)} title="Submit Attendance Request" maxWidth="480px">
        <form onSubmit={submitRequest} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">Request Type</label>
              <select
                value={reqForm.requestType}
                onChange={(e) => setReqForm({ ...reqForm, requestType: e.target.value })}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
              >
                {REQUEST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">Date *</label>
              <input
                type="date"
                required
                value={reqForm.requestDate}
                onChange={(e) => setReqForm({ ...reqForm, requestDate: e.target.value })}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
              />
            </div>
          </div>

          {["Regularization", "Missed Punch", "Attendance Correction"].includes(reqForm.requestType) && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-secondary">Clock In</label>
                <input type="time" value={reqForm.clockIn} onChange={(e) => setReqForm({ ...reqForm, clockIn: e.target.value })} className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-secondary">Clock Out</label>
                <input type="time" value={reqForm.clockOut} onChange={(e) => setReqForm({ ...reqForm, clockOut: e.target.value })} className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-secondary">Reason *</label>
            <textarea
              required
              rows="3"
              value={reqForm.reason}
              onChange={(e) => setReqForm({ ...reqForm, reason: e.target.value })}
              placeholder="Explain your request…"
              className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-border-color">
            <Button type="button" variant="secondary" onClick={() => setReqModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={busy}>Submit Request</Button>
          </div>
        </form>
      </DetailModal>
    </div>
  );
};

export default StaffAttendance;
