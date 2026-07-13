import { useEffect, useState } from "react";
import { getAllLeave } from "../../../../services/api";

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    getAllLeave().then((res) => {
      setLeaves(res.data.data);
    });
  }, []);

  return (
    <div>
      <h3>Leave History</h3>

      {leaves.map((item) => (
        <div key={item.id}>
          {item.leaveType}-{item.status}
        </div>
      ))}
    </div>
  );
};

export default LeaveHistory;
