import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import DataTable from "../../../../components/tables/DataTable";
import Button from "../../../../components/common/Button";
import Badge from "../../../../components/common/Badge";
import { MdSearch, MdDownload, MdPrint, MdGridOn } from "react-icons/md";
import {
  getDepartments,
  getShifts,
  getAllStaff,
  getDailyReport,
  getMonthlyReport,
  getEmployeeReport,
  getDepartmentReport,
  getLateReport,
  getOvertimeReport,
  getBreakReport,
  getMissedPunchReport,
  getAttendanceSummaryReport,
  getShiftReport,
  getHolidayReport,
} from "../../../../services/api";

const time = (v) => (v ? dayjs(v).format("hh:mm A") : "—");

// Reusable column sets ------------------------------------------------------
const recordCols = [
  { header: "Code", key: "employeeCode" },
  { header: "Employee", key: "employeeName" },
  { header: "Department", key: "departmentName" },
  { header: "Date", key: "date" },
  { header: "Clock In", key: "clockIn", fmt: time },
  { header: "Clock Out", key: "clockOut", fmt: time },
  { header: "Hours", key: "workingHours", fmt: (v) => `${Number(v || 0)}h` },
  { header: "Break", key: "breakDuration", fmt: (v) => `${v || 0}m` },
  { header: "Late", key: "lateMinutes", fmt: (v) => `${v || 0}m` },
  { header: "OT", key: "overtimeMinutes", fmt: (v) => `${v || 0}m` },
  { header: "Status", key: "status", badge: true },
];

const monthlyCols = [
  { header: "Code", key: "employeeCode" },
  { header: "Employee", key: "employeeName" },
  { header: "Department", key: "departmentName" },
  { header: "Present", key: "present" },
  { header: "Late", key: "late" },
  { header: "Half Day", key: "halfDay" },
  { header: "Absent", key: "absent" },
  { header: "Leave", key: "leave" },
  { header: "WFH", key: "wfh" },
  { header: "Worked Hrs", key: "workedHours", fmt: (v) => `${v || 0}h` },
  { header: "OT (m)", key: "overtimeMinutes" },
];

const deptCols = [
  { header: "Department", key: "departmentName" },
  { header: "Records", key: "records" },
  { header: "Present", key: "present" },
  { header: "Absent", key: "absent" },
  { header: "Late", key: "late" },
  { header: "Half Day", key: "halfDay" },
  { header: "Leave", key: "leave" },
  { header: "Worked Hrs", key: "workedHours", fmt: (v) => `${v || 0}h` },
  { header: "Rate", key: "attendanceRate", fmt: (v) => `${v || 0}%` },
];

const shiftCols = [
  { header: "Shift", key: "shiftName" },
  { header: "Code", key: "shiftCode" },
  { header: "Type", key: "shiftType" },
  { header: "Start", key: "startTime" },
  { header: "End", key: "endTime" },
  { header: "Required Hrs", key: "requiredHours", fmt: (v) => `${v}h` },
  { header: "Weekly Off", key: "weeklyOff" },
  { header: "Assigned", key: "assignedEmployees" },
  { header: "Active", key: "isActive", fmt: (v) => (v ? "Yes" : "No") },
];

const holidayCols = [
  { header: "Holiday", key: "holidayName" },
  { header: "Date", key: "holidayDate" },
  { header: "Type", key: "holidayType" },
  { header: "Branch", key: "branch", fmt: (v) => v || "All" },
  { header: "Department", key: "department" },
  { header: "Recurring", key: "isRecurring", fmt: (v) => (v ? "Yearly" : "—") },
  { header: "Paid", key: "isPaid", fmt: (v) => (v ? "Paid" : "Unpaid") },
];

// Report registry -----------------------------------------------------------
const REPORTS = {
  daily: { label: "Daily", api: getDailyReport, filter: "date", columns: recordCols },
  monthly: { label: "Monthly", api: getMonthlyReport, filter: "month", columns: monthlyCols },
  employee: { label: "Employee", api: getEmployeeReport, filter: "rangeEmployee", columns: recordCols },
  department: { label: "Department", api: getDepartmentReport, filter: "range", columns: deptCols },
  late: { label: "Late", api: getLateReport, filter: "range", columns: recordCols },
  overtime: { label: "Overtime", api: getOvertimeReport, filter: "range", columns: recordCols },
  break: { label: "Break", api: getBreakReport, filter: "range", columns: recordCols },
  missedPunch: { label: "Missed Punch", api: getMissedPunchReport, filter: "range", columns: recordCols },
  summary: { label: "Summary", api: getAttendanceSummaryReport, filter: "range", columns: [], summaryOnly: true },
  shift: { label: "Shift", api: getShiftReport, filter: "none", columns: shiftCols },
  holiday: { label: "Holiday", api: getHolidayReport, filter: "none", columns: holidayCols },
};

const cellText = (col, row) => {
  const raw = row[col.key];
  return col.fmt ? col.fmt(raw) : raw ?? "";
};

const AttendanceReportsTab = () => {
  const [reportType, setReportType] = useState("daily");
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [filters, setFilters] = useState({
    date: dayjs().format("YYYY-MM-DD"),
    month: dayjs().format("YYYY-MM"),
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
    departmentId: "",
    shiftId: "",
    employeeId: "",
  });

  const config = REPORTS[reportType];

  useEffect(() => {
    Promise.all([getDepartments(), getShifts(), getAllStaff()])
      .then(([d, s, e]) => {
        if (d.data?.success) setDepartments(d.data.data);
        if (s.data?.success) setShifts(s.data.data);
        if (e.data?.success) setEmployees(e.data.data);
      })
      .catch(() => {});
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {};
      const f = config.filter;
      if (f === "date") params.date = filters.date;
      if (f === "month") params.month = filters.month;
      if (f === "range" || f === "rangeEmployee") {
        params.startDate = filters.startDate;
        params.endDate = filters.endDate;
      }
      if (f === "rangeEmployee" && filters.employeeId) params.employeeId = filters.employeeId;
      if (filters.departmentId) params.departmentId = filters.departmentId;
      if (filters.shiftId) params.shiftId = filters.shiftId;

      const res = await config.api(params);
      if (res.data?.success) {
        setRows(res.data.data.rows || []);
        setSummary(res.data.data.summary || null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType]);

  // DataTable columns from config
  const tableColumns = useMemo(
    () =>
      config.columns.map((c) => ({
        header: c.header,
        accessor: c.key,
        sortable: true,
        render: c.badge
          ? (row) => <Badge status={row[c.key]}>{row[c.key]}</Badge>
          : (row) => cellText(c, row),
      })),
    [config]
  );

  // ── Export helpers ─────────────────────────────────────────────────────
  const exportCSV = (asExcel = false) => {
    if (!rows.length) return toast.info("Nothing to export");
    const cols = config.columns;
    const header = cols.map((c) => c.header).join(",");
    const body = rows
      .map((r) =>
        cols
          .map((c) => `"${String(cellText(c, r)).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const csv = `${header}\n${body}`;
    const blob = new Blob([asExcel ? "﻿" + csv : csv], {
      type: asExcel ? "application/vnd.ms-excel" : "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${reportType}-${dayjs().format("YYYYMMDD")}.${asExcel ? "xls" : "csv"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    const cols = config.columns;
    const w = window.open("", "_blank");
    if (!w) return;
    const head = cols.map((c) => `<th>${c.header}</th>`).join("");
    const bodyRows = rows
      .map(
        (r) => `<tr>${cols.map((c) => `<td>${cellText(c, r)}</td>`).join("")}</tr>`
      )
      .join("");
    w.document.write(`
      <html><head><title>Attendance ${config.label} Report</title>
      <style>
        body{font-family:Arial,sans-serif;padding:24px;color:#1e293b}
        h2{margin:0 0 4px}
        p{color:#64748b;margin:0 0 16px;font-size:12px}
        table{width:100%;border-collapse:collapse;font-size:12px}
        th,td{border:1px solid #e2e8f0;padding:6px 8px;text-align:left}
        th{background:#f1f5f9}
      </style></head><body>
      <h2>Attendance — ${config.label} Report</h2>
      <p>Generated ${dayjs().format("DD MMM YYYY, hh:mm A")} · ${rows.length} records</p>
      <table><thead><tr>${head}</tr></thead><tbody>${bodyRows}</tbody></table>
      </body></html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  const summaryCards = summary
    ? [
        { label: "Records", value: summary.totalRecords },
        { label: "Present", value: summary.present },
        { label: "Late", value: summary.late },
        { label: "Half Day", value: summary.halfDay },
        { label: "Absent", value: summary.absent },
        { label: "Leave", value: summary.leave },
        { label: "WFH", value: summary.wfh },
        { label: "Worked Hrs", value: `${summary.totalWorkedHours}h` },
        { label: "Overtime", value: `${summary.totalOvertimeMinutes}m` },
        { label: "Late Mins", value: `${summary.totalLateMinutes}m` },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Report type selector */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(REPORTS).map(([key, r]) => (
          <button
            key={key}
            onClick={() => setReportType(key)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border ${
              reportType === key
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                : "bg-bg-primary text-text-secondary border-border-color hover:border-primary"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Filters + export */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-bg-secondary border border-border-color rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          {config.filter === "date" && (
            <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} className="p-2 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary" />
          )}
          {config.filter === "month" && (
            <input type="month" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })} className="p-2 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary" />
          )}
          {(config.filter === "range" || config.filter === "rangeEmployee") && (
            <>
              <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} className="p-2 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary" />
              <span className="text-text-secondary text-sm">to</span>
              <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} className="p-2 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary" />
            </>
          )}
          {config.filter === "rangeEmployee" && (
            <select value={filters.employeeId} onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })} className="p-2 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary">
              <option value="">All Employees</option>
              {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.fullName}</option>)}
            </select>
          )}
          {["date", "range", "rangeEmployee", "month"].includes(config.filter) && (
            <select value={filters.departmentId} onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })} className="p-2 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary">
              <option value="">All Departments</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          )}
          {["date", "range", "rangeEmployee"].includes(config.filter) && (
            <select value={filters.shiftId} onChange={(e) => setFilters({ ...filters, shiftId: e.target.value })} className="p-2 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary">
              <option value="">All Shifts</option>
              {shifts.map((s) => <option key={s.id} value={s.id}>{s.shiftName}</option>)}
            </select>
          )}
          {config.filter !== "none" && (
            <Button variant="primary" size="sm" onClick={fetchReport} iconBefore={<MdSearch />}>
              Run
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => exportCSV(false)} iconBefore={<MdDownload />}>CSV</Button>
          <Button variant="outline" size="sm" onClick={() => exportCSV(true)} iconBefore={<MdGridOn />}>Excel</Button>
          <Button variant="outline" size="sm" onClick={printReport} iconBefore={<MdPrint />}>Print / PDF</Button>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {summaryCards.map((c) => (
            <div key={c.label} className="bg-bg-secondary border border-border-color rounded-xl p-3 shadow-sm">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{c.label}</p>
              <p className="text-lg font-extrabold text-text-primary">{c.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {config.summaryOnly ? (
        <div className="text-center text-text-secondary text-sm py-6 bg-bg-secondary border border-border-color rounded-lg">
          Summary report — see the metric cards above. Adjust the date range and click Run.
        </div>
      ) : loading ? (
        <div className="py-12 text-center text-text-secondary">Loading report…</div>
      ) : (
        <DataTable
          columns={tableColumns}
          data={rows}
          pageSize={10}
          emptyMessage="No data for the selected filters."
        />
      )}
    </div>
  );
};

export default AttendanceReportsTab;
