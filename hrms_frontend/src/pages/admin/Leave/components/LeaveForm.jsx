import { useState } from "react";
import Button from "../../../../components/common/Button";
import { applyLeave } from "../../../../services/api";
import { toast } from "react-hot-toast";

const LeaveForm = () => {
  const [form, setForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const submit = async () => {
    try {
      await applyLeave(form);

      toast.success("Leave applied successfully");
    } catch (err) {
      toast.error("Failed to apply leave");
    }
  };

  return (
    <div>
      <h3>Apply Leave</h3>

      <input
        placeholder="Leave Type"
        onChange={(e) =>
          setForm({
            ...form,
            leaveType: e.target.value,
          })
        }
      />

      <input
        type="date"
        onChange={(e) =>
          setForm({
            ...form,
            fromDate: e.target.value,
          })
        }
      />

      <input
        type="date"
        onChange={(e) =>
          setForm({
            ...form,
            toDate: e.target.value,
          })
        }
      />

      <textarea
        placeholder="Reason"
        onChange={(e) =>
          setForm({
            ...form,
            reason: e.target.value,
          })
        }
      />

      <Button onClick={submit}>Apply</Button>
    </div>
  );
};

export default LeaveForm;
