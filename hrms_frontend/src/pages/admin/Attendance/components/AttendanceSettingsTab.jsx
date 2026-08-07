import { useState, useEffect } from "react";
import { getAttendanceSettings, updateAttendanceSettings } from "../../../../services/api";
import Button from "../../../../components/common/Button";
import { toast } from "react-toastify";
import Swal from "sweetalert2"; 
const AttendanceSettingsTab = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({

    allowRegularization: true,
    allowShiftChangeRequest: true,
    requireClockOutApproval: false,
    autoClockOutEnabled: true,
    autoMarkAbsent: true,
     captureIpAddress: false,
  captureDeviceInfo: false,
  allowEarlyClockIn: false,
  earlyClockInMinutes: 30,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await getAttendanceSettings();
      if (res.data?.success) {
        const d = res.data.data;
        setFormData({
        allowRegularization: !!d.allowRegularization,
        allowShiftChangeRequest: !!d.allowShiftChangeRequest,
        requireClockOutApproval: !!d.requireClockOutApproval,
        autoClockOutEnabled: !!d.autoClockOutEnabled,
        autoMarkAbsent: !!d.autoMarkAbsent,
        captureIpAddress: !!d.captureIpAddress,
        captureDeviceInfo: !!d.captureDeviceInfo,
        allowEarlyClockIn: !!d.allowEarlyClockIn,
        earlyClockInMinutes: d.earlyClockInMinutes ?? 30,
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
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Attendance settings saved successfully!",
        confirmButtonText: "OK",
      });

      fetchSettings();
    }
  } catch (err) {
    console.log(err.message)
    console.log(err)
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response?.data?.message || "Failed to save settings",
      confirmButtonText: "OK",
      
    });
  }
};

if (loading) {
   return <div className="py-12 text-center text-text-secondary">Loading Settings...</div>;
}

  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm max-w-xl">
      <h3 className="text-base font-bold text-text-primary mb-6">Attendance Policy Configuration</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
   
       
    <div className="flex flex-col gap-4">
  <h4 className="text-sm font-bold text-text-primary">
    Request Policy Authorization
  </h4>

  <div className="flex flex-col gap-3">

    <label className="flex items-center gap-2.5 text-sm text-text-primary cursor-pointer">
      <input
        type="checkbox"
        checked={formData.allowRegularization}
        onChange={(e) =>
          setFormData({
            ...formData,
            allowRegularization: e.target.checked,
          })
        }
      />
      Allow employees to request Attendance Regularization
    </label>

    <label className="flex items-center gap-2.5 text-sm text-text-primary cursor-pointer">
      <input
        type="checkbox"
        checked={formData.allowShiftChangeRequest}
        onChange={(e) =>
          setFormData({
            ...formData,
            allowShiftChangeRequest: e.target.checked,
          })
        }
      />
      Allow employees to submit Shift Change Requests
    </label>

  </div>


  <div className="flex flex-col gap-4 border-t border-border-color pt-4">

  <h4 className="text-sm font-bold text-text-primary">
    Automation & Approval
  </h4>

  <div className="flex flex-col gap-3">

    <label className="flex items-center gap-2.5 text-sm text-text-primary cursor-pointer">
      <input
        type="checkbox"
        checked={formData.requireClockOutApproval}
        onChange={(e) =>
          setFormData({
            ...formData,
            requireClockOutApproval: e.target.checked,
          })
        }
      />
      Require Admin Approval for Clock Out
    </label>

    <label className="flex items-center gap-2.5 text-sm text-text-primary cursor-pointer">
      <input
        type="checkbox"
        checked={formData.autoClockOutEnabled}
        onChange={(e) =>
          setFormData({
            ...formData,
            autoClockOutEnabled: e.target.checked,
          })
        }
      />
      Enable Auto Clock Out
    </label>

    <label className="flex items-center gap-2.5 text-sm text-text-primary cursor-pointer">
      <input
        type="checkbox"
        checked={formData.autoMarkAbsent}
        onChange={(e) =>
          setFormData({
            ...formData,
            autoMarkAbsent: e.target.checked,
          })
        }
      />
      Auto Mark Absent
    </label>

  </div>

</div>


<div className="flex flex-col gap-4 border-t border-border-color pt-4">

  <h4 className="text-sm font-bold text-text-primary">
    Security
  </h4>

  <div className="flex flex-col gap-3">

    <label className="flex items-center gap-2.5 text-sm text-text-primary cursor-pointer">
      <input
        type="checkbox"
        checked={formData.captureIpAddress}
        onChange={(e) =>
          setFormData({
            ...formData,
            captureIpAddress: e.target.checked,
          })
        }
      />
      Capture Employee IP Address
    </label>

    <label className="flex items-center gap-2.5 text-sm text-text-primary cursor-pointer">
      <input
        type="checkbox"
        checked={formData.captureDeviceInfo}
        onChange={(e) =>
          setFormData({
            ...formData,
            captureDeviceInfo: e.target.checked,
          })
        }
      />
      Capture Device & Browser Information
    </label>

  </div>

</div>

<div className="flex flex-col gap-4 border-t border-border-color pt-4">

  <h4 className="text-sm font-bold text-text-primary">
    Early Clock In
  </h4>

  <label className="flex items-center gap-2.5 text-sm text-text-primary cursor-pointer">

    <input
      type="checkbox"
      checked={formData.allowEarlyClockIn}
      onChange={(e) =>
        setFormData({
          ...formData,
          allowEarlyClockIn: e.target.checked,
        })
      }
    />

    Allow Early Clock In

  </label>

  {formData.allowEarlyClockIn && (

    <div className="flex flex-col gap-2">

      <label className="text-xs font-bold text-text-secondary">
        Early Clock In Minutes
      </label>

      <input
        type="number"
        min="0"
        value={formData.earlyClockInMinutes}
        onChange={(e) =>
          setFormData({
            ...formData,
            earlyClockInMinutes: Number(e.target.value),
          })
        }
        className="p-2.5 border border-border-color rounded-md bg-bg-primary text-sm text-text-primary outline-none focus:border-primary w-32"
      />

    </div>

  )}

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
