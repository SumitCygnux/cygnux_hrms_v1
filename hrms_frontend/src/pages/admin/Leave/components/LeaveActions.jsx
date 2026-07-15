import Button from "../../../../components/common/Button";

import { MdCancel, MdCheck, MdCheckCircle, MdClose } from "react-icons/md";

const LeaveActions = ({ id, handleStatusUpdate }) => {
  return (
    <div className="flex items-center gap-2">
    
      <button
        onClick={() => handleStatusUpdate(id, "APPROVED")}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg  border border-green-500  bg-green-50  text-green-700  hover:bg-green-100 transition-all duration-200"
      >
        <MdCheckCircle className="text-lg" />
        <span className="text-sm font-medium">Approve</span>
      </button>


    
      <button
        onClick={() => handleStatusUpdate(id, "REJECTED")}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg  border border-red-500  bg-red-50  text-red-700  hover:bg-red-100  transition-all duration-200"
      >
        <MdCancel className="text-lg" />
        <span className="text-sm font-medium">Reject</span>
      </button>
    </div>
  );
};

export default LeaveActions;
