import { useState } from "react";
import PageHeader from "../../../components/layouts/PageHeader";
import Tabs from "../../../components/common/Tabs";
import AttendanceDashboardTab from "./components/AttendanceDashboardTab";
import AttendanceRecordsTab from "./components/AttendanceRecordsTab";
import ShiftAssignmentTab from "./components/ShiftAssignmentTab";
import HolidayManagementTab from "./components/HolidayManagementTab";
import AttendanceRequestsTab from "./components/AttendanceRequestsTab";
import AttendanceSettingsTab from "./components/AttendanceSettingsTab";

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedShiftId, setSelectedShiftId] = useState("");

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "records", label: "Attendance Records" },
    { id: "assignments", label: "Shift Assignment" },
    { id: "holidays", label: "Holiday Management" },
    { id: "requests", label: "Attendance Requests" },
    { id: "settings", label: "Attendance Settings" },
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
          {activeTab === "assignments" && (
            <ShiftAssignmentTab defaultShiftId={selectedShiftId} />
          )}
          {activeTab === "holidays" && <HolidayManagementTab />}
          {activeTab === "requests" && <AttendanceRequestsTab />}
          {activeTab === "settings" && <AttendanceSettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
