import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../../../components/layouts/PageHeader";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import {
  MdEventBusy,
  MdAdd,
  MdClose,
  MdCheckCircle,
  MdHourglassEmpty,
  MdCancel,
  MdCalendarToday,
} from "react-icons/md";

const leaveBalance = [
  { type: "Sick Leave", total: 12, used: 4, color: "#EF4444", bg: "bg-danger/10", textColor: "text-danger" },
  { type: "Casual Leave", total: 12, used: 2, color: "#F59E0B", bg: "bg-warning/10", textColor: "text-warning" },
  { type: "Paid Leave", total: 24, used: 8, color: "#2563EB", bg: "bg-primary/10", textColor: "text-primary" },
];

const leaveHistory = [
  { id: "LV-001", type: "Paid Leave", from: "2026-03-10", to: "2026-03-12", days: 3, reason: "Family vacation", status: "Approved", applied: "2026-03-01" },
  { id: "LV-002", type: "Sick Leave", from: "2026-04-22", to: "2026-04-23", days: 2, reason: "Fever & rest", status: "Approved", applied: "2026-04-22" },
  { id: "LV-003", type: "Casual Leave", from: "2026-06-25", to: "2026-06-26", days: 2, reason: "Vacation extension.", status: "Pending", applied: "2026-06-12" },
  { id: "LV-004", type: "Paid Leave", from: "2026-01-15", to: "2026-01-17", days: 3, reason: "New Year trip", status: "Rejected", applied: "2026-01-08" },
];

const StaffLeave = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: "Sick Leave", from: "", to: "", reason: "" });
  const [history, setHistory] = useState(leaveHistory);

  const handleApply = () => {
    if (!form.from || !form.to || !form.reason) return;
    const days = Math.max(1, Math.ceil((new Date(form.to) - new Date(form.from)) / (1000 * 60 * 60 * 24)) + 1);
    setHistory([
      {
        id: `LV-${Date.now()}`,
        type: form.type,
        from: form.from,
        to: form.to,
        days,
        reason: form.reason,
        status: "Pending",
        applied: new Date().toISOString().split("T")[0],
      },
      ...history,
    ]);
    setForm({ type: "Sick Leave", from: "", to: "", reason: "" });
    setShowModal(false);
  };

  return (
    <div>
      <PageHeader
        title="My Leave"
        subtitle="View your leave balance, apply for leave and track requests"
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowModal(true)}
            id="apply-leave-btn"
          >
            <MdAdd className="text-base" /> Apply Leave
          </Button>
        }
      />

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
        {leaveBalance.map((lb, i) => {
          const remaining = lb.total - lb.used;
          const pct = Math.round((lb.used / lb.total) * 100);
          return (
            <motion.div
              key={lb.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${lb.bg} ${lb.textColor}`}>
                  <MdCalendarToday />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${lb.bg} ${lb.textColor}`}>
                  {remaining} left
                </span>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{lb.type}</p>
              <p className="text-3xl font-extrabold text-slate-800 mb-3">
                {remaining}<span className="text-base font-medium text-slate-400"> / {lb.total}</span>
              </p>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: lb.color }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">{lb.used} used · {pct}% consumed</p>
            </motion.div>
          );
        })}
      </div>

      {/* Leave History */}
      <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <MdEventBusy className="text-amber-500 text-lg" />
          <span className="text-base font-bold text-slate-800">Leave History</span>
          <span className="ml-auto text-xs text-slate-400">{history.length} requests</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Leave Type", "From", "To", "Days", "Reason", "Applied On", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((req, idx) => (
                <motion.tr
                  key={req.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-700">{req.type}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{req.from}</td>
                  <td className="px-5 py-3.5 text-slate-600">{req.to}</td>
                  <td className="px-5 py-3.5 text-slate-700 font-bold">{req.days}</td>
                  <td className="px-5 py-3.5 text-slate-500 max-w-[180px] truncate">{req.reason}</td>
                  <td className="px-5 py-3.5 text-slate-500">{req.applied}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {req.status === "Approved" && <MdCheckCircle className="text-success text-base" />}
                      {req.status === "Pending" && <MdHourglassEmpty className="text-warning text-base" />}
                      {req.status === "Rejected" && <MdCancel className="text-danger text-base" />}
                      <Badge status={req.status}>{req.status}</Badge>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-md p-7"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">Apply for Leave</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all"
                >
                  <MdClose />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Leave Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all"
                  >
                    <option>Sick Leave</option>
                    <option>Casual Leave</option>
                    <option>Paid Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">From</label>
                    <input
                      type="date"
                      value={form.from}
                      onChange={(e) => setForm({ ...form, from: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">To</label>
                    <input
                      type="date"
                      value={form.to}
                      onChange={(e) => setForm({ ...form, to: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Reason</label>
                  <textarea
                    rows={3}
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    placeholder="Briefly describe the reason..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all resize-none"
                  />
                </div>
                <div className="flex gap-3 mt-2">
                  <Button variant="outline" size="sm" onClick={() => setShowModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleApply} className="flex-1" id="submit-leave-btn">
                    Submit Request
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffLeave;
