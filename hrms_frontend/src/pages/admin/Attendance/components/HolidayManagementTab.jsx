import { useState, useEffect } from "react";
import { getHolidays, createHoliday, updateHoliday, deleteHoliday, getDepartments } from "../../../../services/api";
import DataTable from "../../../../components/tables/DataTable";
import Button from "../../../../components/common/Button";
import Badge from "../../../../components/common/Badge";
import DetailModal from "../../../../components/modals/DetailModal";
import { MdAdd, MdEdit, MdDelete, MdChevronLeft, MdChevronRight, MdList, MdCalendarToday } from "react-icons/md";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const HOLIDAY_TYPES = ["National", "State", "Company", "Branch", "Festival"];

const EMPTY_HOLIDAY = {
  holidayName: "",
  holidayDate: "",
  description: "",
  holidayType: "Company",
  branch: "",
  departmentId: "",
  isRecurring: false,
  isPaid: true,
  isActive: true,
};

const HolidayManagementTab = () => {
  const [holidays, setHolidays] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState("List"); // "List" or "Calendar"

  // Calendar State
  const [currentDate, setCurrentDate] = useState(dayjs());

  // Form Fields
  const [formData, setFormData] = useState(EMPTY_HOLIDAY);

  useEffect(() => {
    fetchHolidays();
    getDepartments()
      .then((res) => res.data?.success && setDepartments(res.data.data))
      .catch(() => {});
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const res = await getHolidays();
      if (res.data?.success) {
        setHolidays(res.data.data);
      }
    } catch (err) {
      console.error("Error loading holidays:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelectedId(null);
    setFormData(EMPTY_HOLIDAY);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (holiday) => {
    setIsEdit(true);
    setSelectedId(holiday.id);
    setFormData({
      holidayName: holiday.holidayName,
      holidayDate: holiday.holidayDate,
      description: holiday.description || "",
      holidayType: holiday.holidayType || "Company",
      branch: holiday.branch || "",
      departmentId: holiday.departmentId || "",
      isRecurring: !!holiday.isRecurring,
      isPaid: holiday.isPaid !== undefined ? holiday.isPaid : true,
      isActive: holiday.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDeleteHoliday = async (id) => {
    if (window.confirm("Are you sure you want to deactivate this holiday?")) {
      try {
        const res = await deleteHoliday(id);
        if (res.data?.success) {
          toast.success("Holiday deactivated successfully");
          fetchHolidays();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete holiday");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      branch: formData.branch?.trim() ? formData.branch.trim() : null,
      departmentId: formData.departmentId || null,
    };
    try {
      if (isEdit && selectedId) {
        const res = await updateHoliday(selectedId, payload);
        if (res.data?.success) {
          toast.success("Holiday updated successfully");
          setIsModalOpen(false);
          fetchHolidays();
        }
      } else {
        const res = await createHoliday(payload);
        if (res.data?.success) {
          toast.success("Holiday created successfully");
          setIsModalOpen(false);
          fetchHolidays();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving holiday");
    }
  };

  // Custom Calendar Calculation Grid
  const generateCalendarDays = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");

    const days = [];
    let day = startDate;

    while (day.isBefore(endDate)) {
      days.push(day);
      day = day.add(1, "day");
    }

    return days;
  };

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const calendarDays = generateCalendarDays();

  const getHolidayForDay = (day) => {
    return holidays.find(
      (h) => h.isActive && dayjs(h.holidayDate).isSame(day, "day")
    );
  };

  const deptName = (id) => departments.find((d) => d.id === id)?.name || "All";

  const columns = [
    { header: "Holiday Name", accessor: "holidayName", sortable: true },
    { header: "Date", accessor: "holidayDate", sortable: true },
    {
      header: "Type",
      accessor: "holidayType",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold text-text-primary">{row.holidayType || "Company"}</span>
      ),
    },
    {
      header: "Scope",
      accessor: "branch",
      render: (row) => (
        <span className="text-xs text-text-secondary">
          {row.branch ? `${row.branch}` : "All"}
          {row.departmentId ? ` · ${deptName(row.departmentId)}` : ""}
        </span>
      ),
    },
    {
      header: "Paid",
      accessor: "isPaid",
      render: (row) => (
        <Badge status={row.isPaid ? "Active" : "InActive"}>{row.isPaid ? "Paid" : "Unpaid"}</Badge>
      ),
    },
    {
      header: "Recurring",
      accessor: "isRecurring",
      render: (row) => (row.isRecurring ? "Yearly" : "—"),
    },
    {
      header: "Status",
      accessor: "isActive",
      sortable: true,
      render: (row) => (
        <Badge status={row.isActive ? "Active" : "InActive"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenEdit(row)} title="Edit Holiday" className="text-primary hover:text-blue-700 text-lg">
            <MdEdit />
          </button>
          {row.isActive && (
            <button onClick={() => handleDeleteHoliday(row.id)} title="Deactivate Holiday" className="text-rose-500 hover:text-rose-700 text-lg">
              <MdDelete />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="py-12 text-center text-text-secondary">Loading Holidays...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-text-primary">Holiday Calendar & List</h3>
          <div className="flex bg-bg-secondary border border-border-color rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("List")}
              className={`p-2 flex items-center justify-center text-lg transition-all ${
                viewMode === "List" ? "bg-primary text-white" : "text-text-secondary hover:bg-bg-primary"
              }`}
              title="Table View"
            >
              <MdList />
            </button>
            <button
              onClick={() => setViewMode("Calendar")}
              className={`p-2 flex items-center justify-center text-lg transition-all ${
                viewMode === "Calendar" ? "bg-primary text-white" : "text-text-secondary hover:bg-bg-primary"
              }`}
              title="Calendar View"
            >
              <MdCalendarToday />
            </button>
          </div>
        </div>

        <Button variant="primary" iconBefore={<MdAdd />} onClick={handleOpenAdd}>
          Add Holiday
        </Button>
      </div>

      {/* Render Dynamic View */}
      {viewMode === "List" ? (
        <DataTable columns={columns} data={holidays} pageSize={8} emptyMessage="No holidays registered yet." />
      ) : (
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          {/* Calendar Navigation */}
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-bold text-text-primary">{currentDate.format("MMMM YYYY")}</h4>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 border border-border-color rounded-md bg-bg-primary hover:bg-bg-secondary text-text-primary text-xl">
                <MdChevronLeft />
              </button>
              <button onClick={nextMonth} className="p-2 border border-border-color rounded-md bg-bg-primary hover:bg-bg-secondary text-text-primary text-xl">
                <MdChevronRight />
              </button>
            </div>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-7 text-center font-semibold text-xs text-text-secondary border-b border-border-color pb-2 mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2 min-h-80">
            {calendarDays.map((day, index) => {
              const isCurrentMonth = day.month() === currentDate.month();
              const holiday = getHolidayForDay(day);

              return (
                <div
                  key={index}
                  className={`border border-border-color rounded-lg p-2 flex flex-col items-start gap-1 justify-between min-h-[90px] relative transition-all ${
                    isCurrentMonth ? "bg-bg-primary" : "bg-bg-secondary/40 opacity-40"
                  } ${holiday ? "border-rose-300 bg-rose-50/10 shadow-sm shadow-rose-100" : ""}`}
                >
                  <span className={`text-xs font-bold ${holiday ? "text-rose-600" : "text-text-secondary"}`}>
                    {day.date()}
                  </span>

                  {holiday && (
                    <div className="bg-rose-500 text-white rounded px-1.5 py-0.5 text-[9px] font-bold w-full truncate" title={holiday.holidayName}>
                      {holiday.holidayName}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Holiday Modal */}
      <DetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEdit ? "Edit Holiday" : "Add Holiday"} maxWidth="450px">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-secondary">Holiday Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Independence Day"
              value={formData.holidayName}
              onChange={(e) => setFormData({ ...formData, holidayName: e.target.value })}
              className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-secondary">Holiday Date *</label>
            <input
              type="date"
              required
              value={formData.holidayDate}
              onChange={(e) => setFormData({ ...formData, holidayDate: e.target.value })}
              className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">Holiday Type</label>
              <select
                value={formData.holidayType}
                onChange={(e) => setFormData({ ...formData, holidayType: e.target.value })}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
              >
                {HOLIDAY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">Branch (optional)</label>
              <input
                type="text"
                placeholder="e.g. Mumbai HQ"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-secondary">Department (optional)</label>
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2.5 text-sm text-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              />
              Recurring (every year)
            </label>
            <label className="flex items-center gap-2.5 text-sm text-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPaid}
                onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
              />
              Paid Holiday
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-secondary">Description</label>
            <textarea
              rows="3"
              placeholder="Enter brief details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-color mt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEdit ? "Update Holiday" : "Save Holiday"}
            </Button>
          </div>
        </form>
      </DetailModal>
    </div>
  );
};

export default HolidayManagementTab;
