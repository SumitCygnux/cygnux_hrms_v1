import Button from "../../../../components/common/Button";
import { updateLeaveStatus } from "../../../../services/api";

import { toast } from "react-hot-toast";

const LeaveApproval = ({ id, reload }) => {
  const update = async (status) => {
    try {
      await updateLeaveStatus(id, status);

      toast.success("Updated successfully");

      reload();
    } catch (err) {
      toast.error("Failed");
    }
  };

  return (
    <div>
      <Button onClick={() => update("APPROVED")}>Approve</Button>

      <Button onClick={() => update("REJECTED")}>Reject</Button>
    </div>
  );
};

export default LeaveApproval;
