import { useState, useEffect } from "react";
import { getAttendanceSettings, updateAttendanceSettings } from "../../../../services/api";
import Button from "../../../../components/common/Button";
import { toast } from "react-toastify";

const AttendanceSettingsTab = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    lateAfterMinutes: 15,
    halfDayAfterHours: 4.0,
    absentAfterHours: 6.0,
    overtimeAfterHours: 8.0,
    allowRegularization: true,
    allowShiftChangeRequest: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await getAttendanceSettings();
      if (res.data?.success) {
        setFormData({
          lateAfterMinutes: res.data.data.lateAfterMinutes,
          halfDayAfterHours: res.data.data.halfDayAfterHours,
          absentAfterHours: res.data.data.absentAfterHours,
          overtimeAfterHours: res.data.data.overtimeAfterHours,
          allowRegularization: res.data.data.allowRegularization,
          allowShiftChangeRequest: res.data.data.allowShiftChangeRequest,
        });
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateAttendanceSettings(formData);
      if (res.data?.success) {
        toast.success("Attendance settings saved successfully!");
        fetchSettings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-text-secondary">Loading Settings...</div>;
  }

  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm max-w-xl">
      <h3 className="text-base font-bold text-text-primary mb-6">Attendance Policy Configuration</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Late Policy */}
        <div className="flex flex-col gap-2 border-b border-border-color pb-4">
          <h4 className="text-sm font-bold text-text-primary">Late Policy Rules</h4>
          <p className="text-xs text-text-secondary mb-1">
            Specify the number of minutes after shift start when an employee is marked Late.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              required
              value={formData.lateAfterMinutes}
              onChange={(e) => setFormData({ ...formData, lateAfterMinutes: Number(e.target.value) })}
              className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary w-32"
            />
            <span className="text-sm text-text-primary">minutes after shift start</span>
          </div>
        </div>

        {/* Half Day & Absent Policy */}
        <div className="flex flex-col gap-4 border-b border-border-color pb-4">
          <h4 className="text-sm font-bold text-text-primary">Half Day & Absent Thresholds</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">Half Day Threshold (Hours)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={formData.halfDayAfterHours}
                onChange={(e) => setFormData({ ...formData, halfDayAfterHours: Number(e.target.value) })}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
              />
              <span className="text-[10px] text-text-secondary">If worked hours are less than this, marked Half Day.</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-secondary">Absent Threshold (Hours)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={formData.absentAfterHours}
                onChange={(e) => setFormData({ ...formData, absentAfterHours: Number(e.target.value) })}
                className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary"
              />
              <span className="text-[10px] text-text-secondary">If worked hours are less than this, marked Absent.</span>
            </div>
          </div>
        </div>

        {/* Overtime Policy */}
        <div className="flex flex-col gap-2 border-b border-border-color pb-4">
          <h4 className="text-sm font-bold text-text-primary">Overtime Parameter</h4>
          <p className="text-xs text-text-secondary mb-1">
            Specify after how many hours worked in a single day does overtime calculate.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="0.1"
              min="0"
              required
              value={formData.overtimeAfterHours}
              onChange={(e) => setFormData({ ...formData, overtimeAfterHours: Number(e.target.value) })}
              className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary w-32"
            />
            <span className="text-sm text-text-primary">hours in a single day</span>
          </div>
        </div>

        {/* Regularization & Shift Change Rules */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold text-text-primary">Request Policy Authorization</h4>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2.5 text-sm text-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowRegularization}
                onChange={(e) => setFormData({ ...formData, allowRegularization: e.target.checked })}
              />
              Allow employees to request Regularization/Missed Punch correction
            </label>

            <label className="flex items-center gap-2.5 text-sm text-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowShiftChangeRequest}
                onChange={(e) => setFormData({ ...formData, allowShiftChangeRequest: e.target.checked })}
              />
              Allow employees to submit Shift Change requests
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-4 border-t border-border-color mt-2">
          <Button type="submit" variant="primary">
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceSettingsTab;
