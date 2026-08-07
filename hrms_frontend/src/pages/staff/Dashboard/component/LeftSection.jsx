import React from "react";
import KPICard from "../../../../components/cards/KPICard";
import Badge from "../../../../components/common/Badge";
import { StackedBarChartComponent } from "../../../../components/charts/ChartWrappers";
import LateArrivalsCard from '../component/LateArrivalsCard';
import MyAttendanceCard from '../component/MyAttendanceCard';
import MyLeaveCard from '../component/MyLeaveCard';
import UpcomingHolidayCard from '../component/UpcomingHolidayCard';

import PageHeader from "../../../../components/layouts/PageHeader";
export default function LeftSection() {
  const kpiData = [
    {
      title: "Expected Working Hours",
      value: "184 H : 00 M",
      border: "border-t-blue-500",
    },
    {
      title: "Actual Working Hours",
      value: "40 H : 00 M",
      border: "border-t-emerald-500",
    },
    {
      title: "Remaining Working Hours",
      value: "144 H : 00 M",
      border: "border-t-amber-500",
    },
    {
      title: "Total Early Out",
      value: "00 H : 00 M",
      border: "border-t-rose-500",
    },
    {
      title: "Total Overtime Hours",
      value: "01 H : 17 M",
      border: "border-t-purple-600",
    },
  ];
  const timelogData = [
    { day: "1", beforeBreak: 8, breakTime: 0, afterBreak: 0, missing: 0 },
    { day: "2", beforeBreak: 0, breakTime: 0, afterBreak: 0, missing: 0 },
    { day: "3", beforeBreak: 3, breakTime: 1, afterBreak: 5, missing: 0 },
    { day: "4", beforeBreak: 3.5, breakTime: 0.8, afterBreak: 4.8, missing: 0 },
    { day: "5", beforeBreak: 3.3, breakTime: 0.8, afterBreak: 5, missing: 0 },
    { day: "6", beforeBreak: 3.3, breakTime: 0.8, afterBreak: 5, missing: 0 },
    { day: "7", beforeBreak: 0, breakTime: 0, afterBreak: 0, missing: 1 },
  ];
  // Bars Configuration
  const timelogBars = [
    { key: "beforeBreak", name: "Before Break", color: "#10b981" },
    { key: "breakTime", name: "Break", color: "#f59e0b" },
    { key: "afterBreak", name: "After Break", color: "#059669" },
    { key: "missing", name: "Missing", color: "#fb7185" },
  ];

  const tasksData = [
    { title: "Submit Progress Report", dueDate: "Today", status: "Pending" },
    {
      title: "Review UI/UX Design System",
      dueDate: "Tomorrow",
      status: "Completed",
    },
  ];

  return (
<div className="w-full lg:w-[70%] h-auto lg:h-full lg:overflow-y-auto no-scrollbar p-2 space-y-4">
         <PageHeader
              title="Dashboard"
              subtitle={`Welcome back EMployee | Executive HR Overview`}
            />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpiData.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-xl p-4 shadow-sm border-t-4 ${item.border}`}
          >
            <h3 className="text-xl font-bold text-gray-800">{item.value}</h3>
            <p className="text-sm font-medium text-gray-500 mt-1">
              {item.title}
            </p>
          </div>
        ))}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kpiData.slice(3, 5).map((item, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-xl p-4 shadow-sm border-t-4 ${item.border}`}
          >
            <h3 className="text-xl font-bold text-gray-800">{item.value}</h3>
            <p className="text-sm font-medium text-gray-500 mt-1">
              {item.title}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 className="text-base font-bold text-gray-800">
            My Timelogs - Aug 2026
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Before Break
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Break
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              After Break
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              Missing
            </span>
          </div>
        </div>

        {/* Reusable Stacked Bar Chart Wrapper */}
        <StackedBarChartComponent
          data={timelogData}
          xKey="day"
          bars={timelogBars}
        />
      </div>


      <div className="w-full space-y-4 p-0 bg-slate-50">
      
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LateArrivalsCard count={1} time="00 H : 03 M" date="03 Aug, 2026" />
        <MyAttendanceCard />
        
        <MyLeaveCard balance={0} booked={4.5} leaveType="UnPaid Leave" />
        <UpcomingHolidayCard />
      </div>

    </div>
    </div>
  );
}
