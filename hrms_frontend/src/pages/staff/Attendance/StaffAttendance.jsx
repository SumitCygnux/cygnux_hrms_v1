import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "../../../components/layouts/PageHeader";
import Badge from "../../../components/common/Badge";
import KPICard from "../../../components/cards/KPICard";
import { BarChartComponent } from "../../../components/charts/ChartWrappers";
import { MdCheckCircle, MdSchedule, MdHome, MdCancel } from "react-icons/md";
import { getAttendanceHistory } from "../../../services/api";

const attendanceLogs = [
  { id: "LOG-001", date: "2026-06-18", checkIn: "08:45 AM", checkOut: "—", hours: "4h 12m", overtime: 0, status: "On-Time" },
  { id: "LOG-002", date: "2026-06-17", checkIn: "08:40 AM", checkOut: "06:15 PM", hours: "9h 35m", overtime: 1.5, status: "On-Time" },
  { id: "LOG-003", date: "2026-06-16", checkIn: "09:12 AM", checkOut: "01:15 PM", hours: "4h 03m", overtime: 0, status: "Half-Day" },
  { id: "LOG-004", date: "2026-06-15", checkIn: "08:45 AM", checkOut: "06:15 PM", hours: "9h 30m", overtime: 1.5, status: "On-Time" },
  { id: "LOG-005", date: "2026-06-14", checkIn: "08:40 AM", checkOut: "06:40 PM", hours: "10h 00m", overtime: 2.0, status: "On-Time" },
  { id: "LOG-006", date: "2026-06-13", checkIn: "08:50 AM", checkOut: "05:30 PM", hours: "8h 40m", overtime: 0, status: "WFH" },
  { id: "LOG-007", date: "2026-06-12", checkIn: "09:05 AM", checkOut: "05:00 PM", hours: "7h 55m", overtime: 0, status: "Late" },
  { id: "LOG-008", date: "2026-06-11", checkIn: "", checkOut: "", hours: "—", overtime: 0, status: "Absent" },
  { id: "LOG-009", date: "2026-06-10", checkIn: "08:55 AM", checkOut: "05:45 PM", hours: "8h 50m", overtime: 0, status: "On-Time" },
  { id: "LOG-010", date: "2026-06-09", checkIn: "08:30 AM", checkOut: "06:00 PM", hours: "9h 30m", overtime: 1.5, status: "On-Time" },
];

const weeklyHours = [
  { name: "Mon", value: 9.5 },
  { name: "Tue", value: 10.0 },
  { name: "Wed", value: 4.1 },
  { name: "Thu", value: 9.3 },
  { name: "Fri", value: 8.7 },
  { name: "Sat", value: 0 },
  { name: "Today", value: 4.2 },
];

const StaffAttendance = () => {
  const [logs, setLogs] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Present", "Late", "Absent", "Half Day", "On Leave", "WFH", "Half-Day"];

  const fetchHistory = async () => {
    try {
      const res = await getAttendanceHistory();
      if (res.data && res.data.success && res.data.data) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch attendance history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const displayLogs = logs.length > 0 ? logs.map(l => ({
    id: l.id,
    date: l.date,
    checkIn: l.clockIn ? new Date(l.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—",
    checkOut: l.clockOut ? new Date(l.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—",
    hours: l.workingHours ? `${l.workingHours}h` : "—",
    overtime: l.workingHours > 8 ? Number((l.workingHours - 8).toFixed(2)) : 0,
    status: l.status
  })) : attendanceLogs;

  const filtered =
    activeFilter === "All"
      ? displayLogs
      : displayLogs.filter((l) => l.status === activeFilter);

  const stats = {
    present: displayLogs.filter((l) =>
      ["Present", "On-Time", "WFH", "Half-Day", "Half Day"].includes(l.status)
    ).length,
    late: displayLogs.filter((l) => l.status === "Late").length,
    wfh: displayLogs.filter((l) => l.status === "WFH").length,
    absent: displayLogs.filter((l) => l.status === "Absent").length,
  };

  return (
    <div>
      <PageHeader
        title="My Attendance"
        subtitle="Track your daily check-in / check-out records and hours"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <KPICard title="Present Days" value={stats.present} icon={<MdCheckCircle />} trend="On-Time + WFH + Half-Day" />
        <KPICard title="Late Arrivals" value={stats.late} icon={<MdSchedule />} trend="Arrived after 09:00 AM" trendType="down" />
        <KPICard title="WFH Days" value={stats.wfh} icon={<MdHome />} trend="Work from home" />
        <KPICard title="Absent Days" value={stats.absent} icon={<MdCancel />} trend="No check-in recorded" trendType="down" />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6 mb-7">
        <div className="flex items-center justify-between mb-1">
          <span className="text-base font-bold text-slate-800">Hours Logged This Week</span>
          <span className="text-xs text-slate-400">Jun 12–18, 2026</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">Your daily working hours including overtime</p>
        <BarChartComponent
          data={weeklyHours}
          xKey="name"
          yKey="value"
          color="#2563EB"
          label="Hours"
        />
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-base font-bold text-slate-800">Attendance Log</p>
            <p className="text-xs text-slate-400 mt-0.5">{displayLogs.length} records found</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Filter
            </span>
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
                {["Date", "Check In", "Check Out", "Hours", "Overtime", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, idx) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5 text-slate-700 font-medium">{log.date}</td>
                  <td className="px-5 py-3.5 text-slate-600">{log.checkIn || "—"}</td>
                  <td className="px-5 py-3.5 text-slate-600">{log.checkOut || "—"}</td>
                  <td className="px-5 py-3.5 text-slate-700 font-semibold">{log.hours}</td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {log.overtime > 0 ? (
                      <span className="text-success font-semibold">+{log.overtime}h</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge status={log.status}>{log.status}</Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-10 text-center text-slate-400 text-sm">No records found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;
