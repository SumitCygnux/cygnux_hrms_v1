import { useState, useEffect } from "react";
import { getShifts, createShift, updateShift, deleteShift } from "../../../../services/api";
import DataTable from "../../../../components/tables/DataTable";
import Button from "../../../../components/common/Button";
import Badge from "../../../../components/common/Badge";
import DetailModal from "../../../../components/modals/DetailModal";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const SATURDAY_POLICIES = [
  { value: "none", label: "No Saturday Off" },
  { value: "all", label: "All Saturdays Off" },
  { value: "1st", label: "1st Saturday Off" },
  { value: "2nd", label: "2nd Saturday Off" },
  { value: "3rd", label: "3rd Saturday Off" },
  { value: "4th", label: "4th Saturday Off" },
  { value: "1st_3rd", label: "1st & 3rd Saturdays Off" },
  { value: "2nd_4th", label: "2nd & 4th Saturdays Off" },
  { value: "1st_4th", label: "1st & 4th Saturdays Off" },
];

const EMPTY_FORM = {
  shiftName: "",
  shiftCode: "",
  startTime: "09:00",
  endTime: "18:00",
  breakMinutes: 60,
  graceMinutes: 10,
  requiredHours: 8,
  halfDayAfter: "",
  absentAfter: "",
  weeklyOff: "Sunday",
  saturdayPolicy: "none",
  isActive: true,
};

const ShiftsTab = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [deletingShift, setDeletingShift] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const res = await getShifts();
      if (res.data?.success) setShifts(res.data.data);
    } catch (err) {
      toast.error("Failed to load shifts");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingShift(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (shift) => {
    setEditingShift(shift);
    setForm({
      shiftName: shift.shiftName,
      shiftCode: shift.shiftCode,
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakMinutes: shift.breakMinutes,
      graceMinutes: shift.graceMinutes,
      requiredHours: shift.requiredHours,
      halfDayAfter: shift.halfDayAfter || "",
      absentAfter: shift.absentAfter || "",
      weeklyOff: shift.weeklyOff,
      saturdayPolicy: shift.saturdayPolicy || "none",
      isActive: shift.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        breakMinutes: Number(form.breakMinutes),
        graceMinutes: Number(form.graceMinutes),
        requiredHours: Number(form.requiredHours),
        halfDayAfter: form.halfDayAfter || null,
        absentAfter: form.absentAfter || null,
      };

      let res;
      if (editingShift) {
        res = await updateShift(editingShift.id, payload);
        toast.success("Shift updated successfully");
      } else {
        res = await createShift(payload);
        toast.success("Shift created successfully");
      }

      if (res.data?.success) {
        setIsModalOpen(false);
        fetchShifts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save shift");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (shift) => {
    setDeletingShift(shift);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingShift) return;
    try {
      await deleteShift(deletingShift.id);
      toast.success("Shift deleted successfully");
      setIsDeleteModalOpen(false);
      fetchShifts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete shift");
    }
  };

  const saturdayLabel = (policy) =>
    SATURDAY_POLICIES.find((p) => p.value === policy)?.label || policy;

  const columns = [
    {
      header: "Shift",
      accessor: "shiftName",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-text-primary">{row.shiftName}</span>
          <span className="text-xs text-text-secondary font-mono">{row.shiftCode}</span>
        </div>
      ),
    },
    {
      header: "Timing",
      accessor: "startTime",
      render: (row) => (
        <span className="text-sm text-text-primary">
          {row.startTime} – {row.endTime}
        </span>
      ),
    },
    {
      header: "Required Hrs",
      accessor: "requiredHours",
      render: (row) => `${row.requiredHours}h`,
    },
    {
      header: "Break",
      accessor: "breakMinutes",
      render: (row) => `${row.breakMinutes}m`,
    },
    {
      header: "Grace",
      accessor: "graceMinutes",
      render: (row) => `${row.graceMinutes}m`,
    },
    {
      header: "Weekly Off",
      accessor: "weeklyOff",
    },
    {
      header: "Saturday Policy",
      accessor: "saturdayPolicy",
      render: (row) => (
        <span className="text-xs text-text-primary">{saturdayLabel(row.saturdayPolicy)}</span>
      ),
    },
    {
      header: "Status",
      accessor: "isActive",
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
          <button
            onClick={() => openEdit(row)}
            className="text-primary hover:text-blue-700 text-lg"
            title="Edit shift"
          >
            <MdEdit />
          </button>
          <button
            onClick={() => confirmDelete(row)}
            className="text-rose-500 hover:text-rose-700 text-lg"
            title="Delete shift"
          >
            <MdDelete />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-bold text-text-primary">Shift Management</p>
          <p className="text-xs text-text-secondary">
            Define working schedules including timings, breaks, and weekend policies.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <MdAdd className="text-base" /> Add Shift
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12 text-center text-text-secondary">Loading shifts...</div>
      ) : (
        <DataTable
          columns={columns}
          data={shifts}
          pageSize={8}
          emptyMessage="No shifts configured yet. Add your first shift."
        />
      )}

      {/* Create / Edit Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingShift ? "Edit Shift" : "Create New Shift"}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">Shift Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Morning Shift"
                value={form.shiftName}
                onChange={(e) => setForm({ ...form, shiftName: e.target.value })}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">Shift Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. MORN"
                value={form.shiftCode}
                onChange={(e) => setForm({ ...form, shiftCode: e.target.value.toUpperCase() })}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary font-mono outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Timing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">Start Time *</label>
              <input
                type="time"
                required
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">End Time *</label>
              <input
                type="time"
                required
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Hours & Minutes */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">Required Hours</label>
              <input
                type="number"
                min="1"
                max="24"
                step="0.5"
                value={form.requiredHours}
                onChange={(e) => setForm({ ...form, requiredHours: e.target.value })}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">Break (mins)</label>
              <input
                type="number"
                min="0"
                value={form.breakMinutes}
                onChange={(e) => setForm({ ...form, breakMinutes: e.target.value })}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">Grace (mins)</label>
              <input
                type="number"
                min="0"
                value={form.graceMinutes}
                onChange={(e) => setForm({ ...form, graceMinutes: e.target.value })}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Optional thresholds */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">Half Day After (time)</label>
              <input
                type="time"
                value={form.halfDayAfter}
                onChange={(e) => setForm({ ...form, halfDayAfter: e.target.value })}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
              />
              <span className="text-[10px] text-text-secondary">
                Clock-in after this time → Half Day
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">Absent After (time)</label>
              <input
                type="time"
                value={form.absentAfter}
                onChange={(e) => setForm({ ...form, absentAfter: e.target.value })}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
              />
              <span className="text-[10px] text-text-secondary">
                Clock-in after this time → Absent
              </span>
            </div>
          </div>

          {/* Weekend Policy */}
          <div className="flex flex-col gap-3 border-t border-border-color pt-4">
            <p className="text-xs font-bold text-text-primary">Weekend / Off-Day Policy</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-secondary">Weekly Off Day</label>
                <select
                  value={form.weeklyOff}
                  onChange={(e) => setForm({ ...form, weeklyOff: e.target.value })}
                  className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
                >
                  <option value="Sunday">Sunday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="None">None (No fixed off)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-secondary">Saturday Policy</label>
                <select
                  value={form.saturdayPolicy}
                  onChange={(e) => setForm({ ...form, saturdayPolicy: e.target.value })}
                  className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
                >
                  {SATURDAY_POLICIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-2.5 text-sm text-text-primary cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Shift is Active
          </label>

          <div className="flex justify-end gap-3 pt-3 border-t border-border-color">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving..." : editingShift ? "Update Shift" : "Create Shift"}
            </Button>
          </div>
        </form>
      </DetailModal>

      {/* Delete Confirm Modal */}
      <DetailModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Shift"
        maxWidth="400px"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-primary">
            Are you sure you want to delete{" "}
            <span className="font-bold">{deletingShift?.shiftName}</span>? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </DetailModal>
    </div>
  );
};

export default ShiftsTab;
