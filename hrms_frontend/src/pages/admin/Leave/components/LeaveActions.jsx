import Button from "../../../../components/common/Button";

import { MdCheck, MdClose } from "react-icons/md";

const LeaveActions = ({ id, handleStatusUpdate }) => {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="success"
        onClick={() => handleStatusUpdate(id, "APPROVED")}
        style={{
          padding: "6px",
        }}
        aria-label="Approve Leave"
      >
        <MdCheck />
      </Button>

      <Button
        size="sm"
        variant="danger"
        onClick={() => handleStatusUpdate(id, "REJECTED")}
        style={{
          padding: "6px",
        }}
        aria-label="Reject Leave"
      >
        <MdClose />
      </Button>
    </div>
  );
};

export default LeaveActions;
