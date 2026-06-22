import { useState, useEffect, useMemo } from "react";
import { getAttendanceRecords, updateAttendanceRecord, getAllStaff, getDepartments, getShifts } from "../../../../services/api";
import DataTable from "../../../../components/tables/DataTable";
import Button from "../../../../components/common/Button";
import Badge from "../../../../components/common/Badge";
import Avatar from "../../../../components/common/Avatar";
import DetailModal from "../../../../components/modals/DetailModal";
import { MdSearch, MdEdit, MdVisibility, MdCalendarToday } from "react-icons/md";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const AttendanceRecordsTab = () => {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]);

  // Filter States
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedShift, setSelectedShift] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Edit fields
  const [clockInTime, setClockInTime] = useState("");
  const [clockOutTime, setClockOutTime] = useState("");
  const [recordStatus, setRecordStatus] = useState("");
  const [workingHoursVal, setWorkingHoursVal] = useState(0);
  const [lateMinVal, setLateMinVal] = useState(0);
  const [overtimeMinVal, setOvertimeMinVal] = useState(0);
  const [breakMinVal, setBreakMinVal] = useState(0);

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [selectedDate, selectedDept, selectedShift, selectedStatus]);

  const fetchMetadata = async () => {
    try {
      const [empRes, deptRes, shiftRes] = await Promise.all([
        getAllStaff(),
        getDepartments(),
        getShifts(),
      ]);
      if (empRes.data?.success) setEmployees(empRes.data.data);
      if (deptRes.data?.success) setDepartments(deptRes.data.data);
      if (shiftRes.data?.success) setShifts(shiftRes.data.data);
    } catch (err) {
      console.error("Error loading filters metadata:", err);
    }
  };

  const fetchRecords = async () => {
    try {
      const params = {};
      if (selectedDate) params.date = selectedDate;
      if (selectedShift !== "All") params.shiftId = selectedShift;
      if (selectedStatus !== "All") params.status = selectedStatus;
      if (selectedDept !== "All") params.departmentId = selectedDept;

      const res = await getAttendanceRecords(params);
      if (res.data?.success) {
        setRecords(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching attendance logs:", err);
    }
  };

  // Search filter
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const nameMatch = rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
      const codeMatch = rec.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());
      return nameMatch || codeMatch;
    });
  }, [records, searchQuery]);

  const handleOpenView = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setSelectedRecord(record);
    setClockInTime(record.clockIn ? dayjs(record.clockIn).format("HH:mm") : "");
    setClockOutTime(record.clockOut ? dayjs(record.clockOut).format("HH:mm") : "");
    setRecordStatus(record.status);
    setWorkingHoursVal(record.workingHours);
    setLateMinVal(record.lateMinutes);
    setOvertimeMinVal(record.overtimeMinutes);
    setBreakMinVal(record.breakDuration);
    setIsEditModalOpen(true);
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    if (!selectedRecord) return;

    try {
      const updatedPayload = {
        clockIn: clockInTime ? `${selectedRecord.date}T${clockInTime}:00` : null,
        clockOut: clockOutTime ? `${selectedRecord.date}T${clockOutTime}:00` : null,
        status: recordStatus,
        workingHours: Number(workingHoursVal),
        lateMinutes: Number(lateMinVal),
        overtimeMinutes: Number(overtimeMinVal),
        breakDuration: Number(breakMinVal),
      };

      const res = await updateAttendanceRecord(selectedRecord.id, updatedPayload);
      if (res.data?.success) {
        toast.success("Attendance record updated successfully!");
        setIsEditModalOpen(false);
        fetchRecords();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update record");
    }
  };

  const columns = [
    {
      header: "Employee",
      accessor: "employeeName",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.employeeName} size={32} />
          <div className="flex flex-col">
            <span className="font-semibold text-text-primary">{row.employeeName}</span>
            <span className="text-xs text-text-secondary">{row.employeeCode}</span>
          </div>
        </div>
      ),
    },
    { header: "Department", accessor: "departmentName", sortable: true },
    { header: "Designation", accessor: "designationName", sortable: true },
    { header: "Shift", accessor: "shiftName", sortable: true },
    {
      header: "Clock In",
      accessor: "clockIn",
      render: (row) => (row.clockIn ? dayjs(row.clockIn).format("hh:mm A") : "—"),
    },
    {
      header: "Clock Out",
      accessor: "clockOut",
      render: (row) => (row.clockOut ? dayjs(row.clockOut).format("hh:mm A") : "—"),
    },
    { header: "Breaks", accessor: "breakDuration", render: (row) => `${row.breakDuration}m` },
    { header: "Work Hours", accessor: "workingHours", render: (row) => `${row.workingHours}h` },
    { header: "Late", accessor: "lateMinutes", render: (row) => `${row.lateMinutes}m` },
    { header: "Overtime", accessor: "overtimeMinutes", render: (row) => `${row.overtimeMinutes}m` },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      render: (row) => <Badge status={row.status}>{row.status}</Badge>,
    },
    {
      header: "Actions",
      accessor: "id",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenView(row)} title="View Logs" className="text-primary hover:text-blue-700 text-lg">
            <MdVisibility />
          </button>
          <button onClick={() => handleOpenEdit(row)} title="Edit Record" className="text-primary hover:text-blue-700 text-lg">
            <MdEdit />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-bg-secondary border border-border-color rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          {/* Search */}
          <div className="flex items-center bg-bg-primary border border-border-color rounded-md px-3 py-2 gap-2 w-64">
            <MdSearch className="text-text-secondary text-lg" />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-text-primary w-full"
            />
          </div>

          {/* Date Picker */}
          <div className="flex items-center bg-bg-primary border border-border-color rounded-md px-3 py-2 gap-2">
            <MdCalendarToday className="text-text-secondary text-sm" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-text-primary cursor-pointer"
            />
          </div>

          {/* Department Select */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="p-2 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Shift Select */}
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="p-2 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
          >
            <option value="All">All Shifts</option>
            {shifts.map((s) => (
              <option key={s.id} value={s.id}>{s.shiftName}</option>
            ))}
          </select>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
          >
            <option value="All">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Half Day">Half Day</option>
            <option value="Work From Home">Work From Home</option>
            <option value="Holiday">Holiday</option>
            <option value="Weekly Off">Weekly Off</option>
            <option value="Missed Punch">Missed Punch</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <DataTable columns={columns} data={filteredRecords} pageSize={8} emptyMessage="No attendance logs found matching filters." />

      {/* View Modal */}
      <DetailModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Attendance Log Details" maxWidth="450px">
        {selectedRecord && (
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex justify-between border-b border-border-color pb-2">
              <span className="font-semibold text-text-secondary">Employee:</span>
              <span className="text-text-primary font-bold">{selectedRecord.employeeName}</span>
            </div>
            <div className="flex justify-between border-b border-border-color pb-2">
              <span className="font-semibold text-text-secondary">Date:</span>
              <span className="text-text-primary">{selectedRecord.date}</span>
            </div>
            <div className="flex justify-between border-b border-border-color pb-2">
              <span className="font-semibold text-text-secondary">Shift:</span>
              <span className="text-text-primary">{selectedRecord.shiftName}</span>
            </div>
            <div className="flex justify-between border-b border-border-color pb-2">
              <span className="font-semibold text-text-secondary">Clock In:</span>
              <span className="text-text-primary">
                {selectedRecord.clockIn ? dayjs(selectedRecord.clockIn).format("hh:mm:ss A") : "—"}
              </span>
            </div>
            <div className="flex justify-between border-b border-border-color pb-2">
              <span className="font-semibold text-text-secondary">Clock Out:</span>
              <span className="text-text-primary">
                {selectedRecord.clockOut ? dayjs(selectedRecord.clockOut).format("hh:mm:ss A") : "—"}
              </span>
            </div>
            <div className="flex justify-between border-b border-border-color pb-2">
              <span className="font-semibold text-text-secondary">Working Hours:</span>
              <span className="text-text-primary font-bold">{selectedRecord.workingHours} hrs</span>
            </div>
            <div className="flex justify-between border-b border-border-color pb-2">
              <span className="font-semibold text-text-secondary">Late Arrival:</span>
              <span className="text-text-primary text-rose-500">{selectedRecord.lateMinutes} mins</span>
            </div>
            <div className="flex justify-between border-b border-border-color pb-2">
              <span className="font-semibold text-text-secondary">Overtime:</span>
              <span className="text-text-primary text-emerald-600">{selectedRecord.overtimeMinutes} mins</span>
            </div>
            <div className="flex justify-between border-b border-border-color pb-2">
              <span className="font-semibold text-text-secondary">Break Duration:</span>
              <span className="text-text-primary">{selectedRecord.breakDuration} mins</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold text-text-secondary">Attendance Status:</span>
              <Badge status={selectedRecord.status}>{selectedRecord.status}</Badge>
            </div>
          </div>
        )}
      </DetailModal>

      {/* Edit Modal */}
      <DetailModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modify Attendance Record" maxWidth="500px">
        {selectedRecord && (
          <form onSubmit={handleUpdateRecord} className="flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-bg-primary p-3 rounded-lg border border-border-color mb-2">
              <Avatar name={selectedRecord.employeeName} size={40} />
              <div className="flex flex-col">
                <span className="font-bold text-text-primary">{selectedRecord.employeeName}</span>
                <span className="text-xs text-text-secondary">Date: {selectedRecord.date} | Shift: {selectedRecord.shiftName}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-secondary">Clock In Time</label>
                <input
                  type="time"
                  value={clockInTime}
                  onChange={(e) => setClockInTime(e.target.value)}
                  className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-secondary">Clock Out Time</label>
                <input
                  type="time"
                  value={clockOutTime}
                  onChange={(e) => setClockOutTime(e.target.value)}
                  className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-secondary">Working Hours</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="24"
                  value={workingHoursVal}
                  onChange={(e) => setWorkingHoursVal(e.target.value)}
                  className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-secondary">Break Duration (mins)</label>
                <input
                  type="number"
                  min="0"
                  value={breakMinVal}
                  onChange={(e) => setBreakMinVal(e.target.value)}
                  className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-secondary">Late Minutes</label>
                <input
                  type="number"
                  min="0"
                  value={lateMinVal}
                  onChange={(e) => setLateMinVal(e.target.value)}
                  className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-secondary">Overtime Minutes</label>
                <input
                  type="number"
                  min="0"
                  value={overtimeMinVal}
                  onChange={(e) => setOvertimeMinVal(e.target.value)}
                  className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">Attendance Status</label>
              <select
                value={recordStatus}
                onChange={(e) => setRecordStatus(e.target.value)}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
                <option value="Half Day">Half Day</option>
                <option value="Work From Home">Work From Home</option>
                <option value="Holiday">Holiday</option>
                <option value="Weekly Off">Weekly Off</option>
                <option value="Missed Punch">Missed Punch</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border-color mt-4">
              <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </DetailModal>
    </div>
  );
};

export default AttendanceRecordsTab;
