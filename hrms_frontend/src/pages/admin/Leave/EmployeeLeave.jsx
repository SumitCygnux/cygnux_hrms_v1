import { useEffect, useState } from "react";

import PageHeader from "../../../components/layouts/PageHeader";

import LeaveStats from "./components/LeaveStats";
import LeaveTable from "./components/LeaveTable";

import {
  getAllLeave,
  getAllStaff,
  updateLeaveStatus,
} from "../../../services/api";

const EmployeeLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
  try {
    const leaveRes = await getAllLeave();
    const staffRes = await getAllStaff();

    const allLeaves = leaveRes.data.data || [];

    let filteredLeaves = [];

    if (role === "TENANT_ADMIN" || role === "SUPER_ADMIN") {
   
        filteredLeaves = allLeaves;
        
    } else if (role === "HR") {
      
      filteredLeaves = allLeaves.filter(
        (leave) => leave.approverRole === "HR");
    } else if (role === "MANAGER") {
  
      filteredLeaves = allLeaves.filter(
        (leave) => leave.approverRole === "HR");
    }

    setLeaves(filteredLeaves);
    setEmployees(staffRes.data.data || []);

  } catch (err) {
    console.log(err);
  }
};

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);

      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  // HR ane TENANT_ADMIN j approve kari sake
  const canApprove = role === "HR" || role === "TENANT_ADMIN" || role === "SUPER_ADMIN";

  return (
    <div>
      <PageHeader title="Employee Leave" />

      <LeaveStats leaves={leaves} />

      <LeaveTable
        leaves={leaves}
        employees={employees}
        canApprove={canApprove}
        handleStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default EmployeeLeave;
