import { useState } from "react";
import PageHeader from "../../../components/layouts/PageHeader";
import Tabs from "../../../components/common/Tabs";
import AttendanceDashboardTab from "./components/AttendanceDashboardTab";
import AttendanceRecordsTab from "./components/AttendanceRecordsTab";
import ShiftsTab from "./components/ShiftsTab";
import ShiftAssignmentTab from "./components/ShiftAssignmentTab";
import HolidayManagementTab from "./components/HolidayManagementTab";
import AttendanceRequestsTab from "./components/AttendanceRequestsTab";
import AttendanceReportsTab from "./components/AttendanceReportsTab";
import AttendanceSettingsTab from "./components/AttendanceSettingsTab";

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "records", label: "Records" },
    { id: "shifts", label: "Shifts" },
    { id: "assignments", label: "Shift Assignment" },
    { id: "holidays", label: "Holidays" },
    { id: "requests", label: "Requests" },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Attendance Center"
        subtitle="Manage daily logs, shifts, settings, requests and holiday calendars."
      />

      <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-4">
          {activeTab === "dashboard" && <AttendanceDashboardTab />}
          {activeTab === "records" && <AttendanceRecordsTab />}
          {activeTab === "shifts" && <ShiftsTab />}
          {activeTab === "assignments" && <ShiftAssignmentTab />}
          {activeTab === "holidays" && <HolidayManagementTab />}
          {activeTab === "requests" && <AttendanceRequestsTab />}
          {activeTab === "reports" && <AttendanceReportsTab />}
          {activeTab === "settings" && <AttendanceSettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
