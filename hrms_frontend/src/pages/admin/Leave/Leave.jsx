// import { useState, useEffect, useMemo } from "react";

// import PageHeader from "../../../components/layouts/PageHeader";

// import LeaveStats from "./components/LeaveStats";
// import LeaveTable from "./components/LeaveTable";
// import ApplyLeave from "./components/ApplyLeave";
// import MyLeaveHistory from "./components/MyLeaveHistory";
// import EmployeeLeaveStats from "./components/EmployeeLeaveStats";

// import { usePermission } from "../../../hooks/usePermission";

// import {
//   getAllLeave,
//   getAllStaff,
//   updateLeaveStatus,
//   getLeave,
// } from "../../../services/api";

// import { toast } from "react-toastify";

// const Leave = () => {
//   const { canView, canCreate, canApprove } = usePermission("leave");

//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const role = user?.role;

//   const [leaves, setLeaves] = useState([]);
//   const [myLeaves, setMyLeaves] = useState([]);
//   const [employees, setEmployees] = useState([]);

//   useEffect(() => {
//     fetchStaff();

//     fetchMyLeaves();

//     fetchLeaves();
//   }, []);

//   const fetchMyLeaves = async () => {
//     try {
//       const res = await getLeave();

//       setMyLeaves(res.data.data || []);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const fetchLeaves = async () => {
//     try {
//       const res = await getAllLeave();

//       setLeaves(res.data.data || []);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const fetchStaff = async () => {
//     try {
//       const res = await getAllStaff();

//       setEmployees(res.data.data || []);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleStatusUpdate = async (id, status) => {
//     try {
//       const res = await updateLeaveStatus(id, status);

//       toast.success(res.data.message);

//       fetchLeaves();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update leave");
//     }
//   };

//   const formattedLeaves = useMemo(() => {
//     return leaves.map((leave) => {
//       const emp = employees.find((e) => e.id === leave.staffId);

//       return {
//         ...leave,

//         employeeName: emp?.fullName || "-",

//         employeeRole: emp?.role || emp?.accessRole,
//       };
//     });
//   }, [leaves, employees]);

//   const approvalLeaves = useMemo(() => {
//     if (role === "TENANT_ADMIN") {

//       return formattedLeaves.filter(
//         (leave) => leave.approverRole === "TENANT_ADMIN",
//       );
//     }

//     if (role === "HR") {

//       return formattedLeaves.filter((leave) => leave.approverRole === "HR");
//     }

//     if (role === "MANAGER") {
//       return formattedLeaves.filter(
//         (leave) => leave.approverRole === "MANAGER",
//       );
//     }

//     return [];
//   }, [formattedLeaves, role]);

//   return (
//     <div>
//       <PageHeader
//         title="Leave Management"
//         subtitle="Manage and apply for employee leaves"
//         actions={
//           canCreate ? <ApplyLeave refreshLeaves={fetchMyLeaves} /> : null
//         }
//       />

//       {canView && <EmployeeLeaveStats leaves={myLeaves} />}

//       {canView && role !== "EMPLOYEE" && <LeaveStats leaves={approvalLeaves} />}

//       {myLeaves.length > 0 && <MyLeaveHistory leaves={myLeaves} />}

//       {canApprove && approvalLeaves.length > 0 && (
//         <LeaveTable
//           leaves={approvalLeaves}
//           employees={employees}
//           canApprove={canApprove}
//           handleStatusUpdate={handleStatusUpdate}
//         />
//       )}
//     </div>
//   );
// };

// export default Leave;

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

      {canView && <EmployeeLeaveStats leaves={myLeaves} />}

      {myLeaves.length > 0 && <MyLeaveHistory leaves={myLeaves} />}
    </div>
  );
};

export default MyLeave;
