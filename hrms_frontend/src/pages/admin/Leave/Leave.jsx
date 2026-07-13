
// import { useState, useEffect, useMemo } from "react";

// import PageHeader from "../../../components/layouts/PageHeader";

// import LeaveStats from "./components/LeaveStats";
// import LeaveTable from "./components/LeaveTable";
// import ApplyLeave from "./components/ApplyLeave";
// import MyLeaveHistory from "./components/MyLeaveHistory";
// import { usePermission } from "../../../hooks/usePermission";

// import {
//   getAllLeave,
//   getAllStaff,
//   updateLeaveStatus,
//   getLeave,
// } from "../../../services/api";

// import { toast } from "react-toastify";
// import EmployeeLeaveStats from "./components/EmployeeLeaveStats";

// const Leave = () => {
//   const { canView, canCreate, canApprove } = usePermission("leave");

//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   const role = user?.role;

//   const [leaves, setLeaves] = useState([]);
//   const [myLeaves, setMyLeaves] = useState([]);
//   const [employees, setEmployees] = useState([]);

//   useEffect(() => {
//     fetchStaff();

//     if (role === "EMPLOYEE") {
//       fetchMyLeaves();
//     } else {
//       fetchLeaves();
//     }
//   }, []);

//   const fetchMyLeaves = async () => {
//     try {
//       const res = await getLeave();

//       console.log("My Leaves", res.data.data);

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

//       toast.success(res.data.message || "Leave updated successfully");
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
//         avatarColor: emp?.avatarColor,
//       };
//     });
//   }, [leaves, employees]);

//   return (
//     <div>
//       <PageHeader
//         title="Leave Management"
//         subtitle="Manage and apply for employee leaves"
//         actions={
//           canCreate ? (
//             <ApplyLeave refreshLeaves={fetchMyLeaves} />
//           ) : null 
//         } 
//       />

//       {canView && role !== "EMPLOYEE" && (
//         <LeaveStats leaves={formattedLeaves} />
//       )}
      
//       {canView && role === "EMPLOYEE" && (
//         <EmployeeLeaveStats leaves={myLeaves} />
//       )}

//       {role === "EMPLOYEE" && <MyLeaveHistory leaves={myLeaves} />}
//       {canApprove && (
//         <LeaveTable
//           leaves={formattedLeaves}
//           employees={employees}
//           canApprove={canApprove}
//           handleStatusUpdate={handleStatusUpdate}
//         />
//       )}
//     </div>
//   );
// };

// export default Leave;


import { useState, useEffect, useMemo } from "react";

import PageHeader from "../../../components/layouts/PageHeader";

import LeaveStats from "./components/LeaveStats";
import LeaveTable from "./components/LeaveTable";
import ApplyLeave from "./components/ApplyLeave";
import MyLeaveHistory from "./components/MyLeaveHistory";
import EmployeeLeaveStats from "./components/EmployeeLeaveStats";

import { usePermission } from "../../../hooks/usePermission";

import {
  getAllLeave,
  getAllStaff,
  updateLeaveStatus,
  getLeave,
} from "../../../services/api";

import { toast } from "react-toastify";


const Leave = () => {

  const {
    canView,
    canCreate,
    canApprove
  } = usePermission("leave");


  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );


  const role = user?.role;


  const [leaves,setLeaves] = useState([]);
  const [myLeaves,setMyLeaves] = useState([]);
  const [employees,setEmployees] = useState([]);



  useEffect(()=>{

    fetchStaff();

    fetchMyLeaves();

    fetchLeaves();

  },[]);



  // Login user own leave

  const fetchMyLeaves = async()=>{

    try{

      const res = await getLeave();

      setMyLeaves(
        res.data.data || []
      );

    }catch(err){

      console.log(err);

    }

  };



  // All leave data

  const fetchLeaves = async()=>{

    try{

      const res = await getAllLeave();

      setLeaves(
        res.data.data || []
      );


    }catch(err){

      console.log(err);

    }

  };




  const fetchStaff = async()=>{

    try{

      const res = await getAllStaff();

      setEmployees(
        res.data.data || []
      );


    }catch(err){

      console.log(err);

    }

  };





  const handleStatusUpdate = async(
    id,
    status
  )=>{


    try{


      const res =
      await updateLeaveStatus(
        id,
        status
      );


      toast.success(
        res.data.message
      );


      fetchLeaves();


    }catch(err){

      toast.error(
        err.response?.data?.message ||
        "Failed to update leave"
      );

    }

  };





  // Add employee name

  const formattedLeaves = useMemo(()=>{


    return leaves.map((leave)=>{


      const emp =
      employees.find(
        e=>e.id === leave.staffId
      );


      return {

        ...leave,

        employeeName:
        emp?.fullName || "-",

        employeeRole:
        emp?.role || emp?.accessRole

      };


    });


  },[
    leaves,
    employees
  ]);





  // Approval Leave Filter

  const approvalLeaves = useMemo(()=>{


    if(
      role === "TENANT_ADMIN"
    ){

      // Admin all HR + Manager + Employee

      return formattedLeaves.filter(
        leave =>
        leave.approverRole === "TENANT_ADMIN"
      );

    }



    if(
      role === "HR"
    ){

      // HR approve employee leave

      return formattedLeaves.filter(
        leave =>
        leave.approverRole === "HR"
      );

    }



    if(
      role === "MANAGER"
    ){

      return formattedLeaves.filter(
        leave =>
        leave.approverRole === "MANAGER"
      );

    }



    return [];


  },[
    formattedLeaves,
    role
  ]);





  return (

    <div>


      <PageHeader

        title="Leave Management"

        subtitle="Manage and apply for employee leaves"


        actions={

          canCreate ?

          <ApplyLeave
            refreshLeaves={
              fetchMyLeaves
            }
          />

          :

          null

        }

      />




      {/* Own Leave Card */}

      {
        canView && (

          <EmployeeLeaveStats
            leaves={myLeaves}
          />

        )
      }






      {/* Approval Statistics */}

      {
        canView && role !== "EMPLOYEE" && (

          <LeaveStats
            leaves={
              approvalLeaves
            }
          />

        )
      }






      {/* Own History */}

      {
        myLeaves.length > 0 && (

          <MyLeaveHistory
            leaves={myLeaves}
          />

        )
      }







      {/* Approve Table */}

      {
        canApprove &&
        approvalLeaves.length > 0 && (

          <LeaveTable

            leaves={
              approvalLeaves
            }

            employees={
              employees
            }

            canApprove={
              canApprove
            }


            handleStatusUpdate={
              handleStatusUpdate
            }

          />

        )
      }




    </div>

  );

};


export default Leave;