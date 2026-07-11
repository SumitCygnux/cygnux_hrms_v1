import { useState } from "react";
import Button from "../../../../components/common/Button";

import { toast } from "react-hot-toast";

import { applyLeave } from "../../../../services/api";

import { MdAdd } from "react-icons/md";

const ApplyLeave = ({ refreshLeaves }) => {
  const [form, setForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await applyLeave(form);

      toast.success(res.data.message || "Leave applied successfully");

      setForm({
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      refreshLeaves && refreshLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 mb-7">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-lg text-text-primary">Apply Leave</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-medium text-text-secondary">
            Leave Type
          </label>

          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            className="w-full mt-2 border border-border-color rounded-lg px-3 py-2"
          >
            <option value="">Select Leave Type</option>

            <option value="CASUAL">Casual Leave</option>

            <option value="SICK">Sick Leave</option>

            <option value="PAID">Paid Leave</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-text-secondary">
            From Date
          </label>

          <input
            type="date"
            name="fromDate"
            value={form.fromDate}
            onChange={handleChange}
            className="w-full mt-2 border border-border-color rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-text-secondary">
            To Date
          </label>

          <input
            type="date"
            name="toDate"
            value={form.toDate}
            onChange={handleChange}
            className="w-full mt-2 border border-border-color rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-text-secondary">
            Reason
          </label>

          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            className="w-full mt-2 border border-border-color rounded-lg px-3 py-2"
            placeholder="Enter reason"
          />
        </div>
      </div>

      <div className="flex justify-end mt-5">
        <Button onClick={handleSubmit} disabled={loading}>
          <MdAdd />

          {loading ? "Applying..." : "Apply Leave"}
        </Button>
      </div>
    </div>
  );
};

export default ApplyLeave;
