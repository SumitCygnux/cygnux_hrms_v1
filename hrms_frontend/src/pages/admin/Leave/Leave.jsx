
import { useEffect, useState } from "react";
import PageHeader from "../../../components/layouts/PageHeader";
import ApplyLeave from "./components/ApplyLeave";
import EmployeeLeaveStats from "./components/EmployeeLeaveStats";
import MyLeaveHistory from "./components/MyLeaveHistory";

import { getLeave } from "../../../services/api";

import { usePermission } from "../../../hooks/usePermission";

const MyLeave = () => {
  const { canView, canCreate } = usePermission("my_leave");

  const [myLeaves, setMyLeaves] = useState([]);

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const fetchMyLeaves = async () => {
    try {
      const res = await getLeave();

      setMyLeaves(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <PageHeader
        title="My Leave"
        subtitle="Manage your leaves"
        actions={
          canCreate ? <ApplyLeave refreshLeaves={fetchMyLeaves} /> : null
        }
      />

      {canView && <EmployeeLeaveStats leaves={myLeaves}/>}
      {myLeaves.length > 0 && <MyLeaveHistory leaves={myLeaves} />}
    </div>
  );
};

export default MyLeave;
