import { useState, useMemo } from "react";
import { useHRMSData } from "../../context/HRMSDataContext";
import PageHeader from "../../components/layout/PageHeader";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Avatar from "../../components/common/Avatar";
import { BarChartComponent, AreaChartComponent } from "../../components/charts/ChartWrappers";
import { MdSearch, MdFingerprint } from "react-icons/md";

const Attendance = () => {
  const { attendanceLogs, employees, currentUser, handleClockInOut } = useHRMSData();

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("2026-06-15"); // default simulated today

  // Stats
  const stats = useMemo(() => {
    const dayLogs = attendanceLogs.filter((l) => l.date === selectedDate);
    const present = dayLogs.filter((l) => l.status === "On-Time" || l.status === "WFH").length;
    const absent = dayLogs.filter((l) => l.status === "Absent").length;
    const late = dayLogs.filter((l) => l.status === "Late").length;
    const halfDay = dayLogs.filter((l) => l.status === "Half-Day").length;
    const wfh = dayLogs.filter((l) => l.status === "WFH").length;
    return { present, absent, late, halfDay, wfh };
  }, [attendanceLogs, selectedDate]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return attendanceLogs.filter((log) => {
      const emp = employees.find((e) => e.id === log.employeeId);
      const matchesSearch = emp
        ? emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.id.toLowerCase().includes(searchQuery.toLowerCase())
        : false;

      const matchesStatus = selectedStatus === "All" || log.status === selectedStatus;
      const matchesDate = !selectedDate || log.date === selectedDate;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [attendanceLogs, employees, searchQuery, selectedStatus, selectedDate]);

  const handleSelfClock = () => {
    handleClockInOut(currentUser.id);
  };

  // Recharts Mocks
  const monthlyAttendanceData = [
    { name: "Week 1", value: 92 },
    { name: "Week 2", value: 95 },
    { name: "Week 3", value: 91 },
    { name: "Week 4", value: 94 }
  ];

  const deptAttendanceData = [
    { name: "Eng", value: 96 },
    { name: "HR", value: 100 },
    { name: "Sales", value: 88 },
    { name: "Finance", value: 95 },
    { name: "Prod", value: 92 },
    { name: "CS", value: 90 }
  ];

  // Table Columns
  const columns = [
    {
      header: "Employee",
      accessor: "employeeId",
      sortable: true,
      render: (row) => {
        const emp = employees.find((e) => e.id === row.employeeId);
        return (
          <div className="flex items-center gap-3">
            <Avatar name={emp?.name || "Unknown"} color={emp?.avatarColor || "#CBD5E1"} size={36} />
            <div className="flex flex-col">
              <span className="font-semibold text-text-primary">{emp?.name || "Unknown"}</span>
              <span className="text-xs text-text-secondary">{row.employeeId}</span>
            </div>
          </div>
        );
      }
    },
    { header: "Date", accessor: "date", sortable: true },
    { header: "Check In", accessor: "checkIn", sortable: false, render: (row) => row.checkIn || "--:--" },
    { header: "Check Out", accessor: "checkOut", sortable: false, render: (row) => row.checkOut || "--:--" },
    { header: "Working Hours", accessor: "hours", sortable: true, render: (row) => `${row.hours} hrs` },
    { header: "Overtime", accessor: "overtime", sortable: true, render: (row) => `${row.overtime} hrs` },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      render: (row) => <Badge status={row.status}>{row.status}</Badge>
    }
  ];

  return (
    <div>
      <PageHeader
        title="Attendance Dashboard"
        subtitle="Track daily, weekly and monthly employee logs"
        actions={
          <Button variant="primary" iconBefore={<MdFingerprint />} onClick={handleSelfClock}>
            Clock In / Out (Self)
          </Button>
        }
      />

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <div className="bg-bg-secondary border border-border-color rounded-lg p-5 text-center shadow-sm flex flex-col gap-2 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary">
          <span className="text-xs font-semibold text-text-secondary">Present</span>
          <span className="text-3xl font-extrabold text-text-primary">{stats.present}</span>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-lg p-5 text-center shadow-sm flex flex-col gap-2 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary">
          <span className="text-xs font-semibold text-text-secondary">Absent</span>
          <span className="text-3xl font-extrabold text-text-primary">{stats.absent}</span>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-lg p-5 text-center shadow-sm flex flex-col gap-2 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary">
          <span className="text-xs font-semibold text-text-secondary">Late Check-ins</span>
          <span className="text-3xl font-extrabold text-warning">{stats.late}</span>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-lg p-5 text-center shadow-sm flex flex-col gap-2 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary">
          <span className="text-xs font-semibold text-text-secondary">Half Days</span>
          <span className="text-3xl font-extrabold text-text-primary">{stats.halfDay}</span>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-lg p-5 text-center shadow-sm flex flex-col gap-2 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary">
          <span className="text-xs font-semibold text-text-secondary">Work From Home</span>
          <span className="text-3xl font-extrabold text-info">{stats.wfh}</span>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-7">
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm lg:col-span-2">
          <span className="text-base font-bold text-text-primary mb-4 block">Monthly Attendance Analytics (%)</span>
          <AreaChartComponent data={monthlyAttendanceData} xKey="name" yKey="value" color="#2563EB" />
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm lg:col-span-1">
          <span className="text-base font-bold text-text-primary mb-4 block">Department Attendance Rates (%)</span>
          <BarChartComponent data={deptAttendanceData} xKey="name" yKey="value" color="#10B981" label="Rate" />
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-5 bg-bg-secondary border border-border-color rounded-lg p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 flex-1 items-stretch sm:items-center">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md px-3 py-2 gap-2 w-64">
            <MdSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by Employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-gray-800 w-full"
            />
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none cursor-pointer focus:border-primary transition-all"
          />

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="On-Time">On-Time</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
            <option value="Half-Day">Half-Day</option>
            <option value="WFH">Work From Home</option>
          </select>
        </div>
      </div>

      {/* Attendance Logs Table */}
      <DataTable columns={columns} data={filteredLogs} pageSize={8} emptyMessage="No attendance logs found matching filters." />
    </div>
  );
};

export default Attendance;
