import { useEffect, useState } from "react";
import { getAllLeave, updateLeaveStatus } from "../../../../services/api";

import LeaveApproval from "./LeaveApproval";

const LeaveRequestTable = () => {
  const [leaves, setLeaves] = useState([]);

  const load = () => {
    getAllLeave().then((res) => {
      setLeaves(res.data.data);
    });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h3>Leave Requests</h3>

      {leaves.map((row) => (
        <div key={row.id}>
          <p>{row.leaveType}</p>

          <p>{row.status}</p>

          {row.status === "PENDING" && (
            <LeaveApproval id={row.id} reload={load} />
          )}
        </div>
      ))}
    </div>
  );
};

export default LeaveRequestTable;
