import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../../../components/common/Button";
import { applyLeave } from "../../../../services/api";
import { toast } from "react-toastify";

const ApplyLeave = ({ refreshLeaves }) => {
  const [showModal, setShowModal] = useState(false);

  const [isMultiDay, setIsMultiDay] = useState(false);

  const [form, setForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });
  const today = new Date().toISOString().split("T")[0];
  const handleApply = async () => {
    try {
      const from = form.fromDate;
      const to = isMultiDay ? form.toDate : form.fromDate;

      if (!form.leaveType || !from || !to || !form.reason) {
        toast.error("All fields are required");
        return;
      }

      if (new Date(to) < new Date(from)) {
        toast.error("To Date cannot be earlier than From Date");
        return;
      }

      const res = await applyLeave({
        ...form,
        fromDate: from,
        toDate: to,
      });

      toast.success(res.data.message || "Leave applied successfully");

      refreshLeaves && refreshLeaves();

      setForm({
        leaveType: "Sick Leave",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
        Apply Leave
      </Button>

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
                <h2 className="text-lg font-bold text-slate-800">
                  Apply for Leave
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-sm transition-all"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Leave Type
                  </label>
                  <select
                    value={form.leaveType}
                    onChange={(e) =>
                      setForm({ ...form, leaveType: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all"
                  >
                    <option value="" disabled > Select Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Paid Leave">Paid Leave</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    id="isMultiDay"
                    checked={isMultiDay}
                    onChange={(e) => {
                      setIsMultiDay(e.target.checked);
                      if (!e.target.checked) {
                        setForm((prev) => ({ ...prev, toDate: prev.fromDate }));
                      }
                    }}
                    className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                  />
                  <label
                    htmlFor="isMultiDay"
                    className="text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    Apply for Multiple Days
                  </label>
                </div>

                {!isMultiDay ? (
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={form.fromDate}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fromDate: e.target.value,
                          toDate: e.target.value,
                        })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                        From
                      </label>
                      <input
                        type="date"
                        min={form.fromDate || today}
                        value={form.fromDate}
                        onChange={(e) =>
                          setForm({ ...form, fromDate: e.target.value })
                        }
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                        To
                      </label>
                      <input
                        type="date"
                        value={form.toDate}
                        onChange={(e) =>
                          setForm({ ...form, toDate: e.target.value })
                        }
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Reason
                  </label>
                  <textarea
                    rows={3}
                    value={form.reason}
                    onChange={(e) =>
                      setForm({ ...form, reason: e.target.value })
                    }
                    placeholder="Briefly describe the reason..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all resize-none"
                  />
                </div>
                <div className="flex gap-3 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleApply}
                    className="flex-1"
                    id="submit-leave-btn"
                  >
                    Submit Request
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ApplyLeave;
