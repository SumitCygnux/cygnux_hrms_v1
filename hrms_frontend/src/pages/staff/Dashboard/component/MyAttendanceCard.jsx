import React from 'react';

export default function MyAttendanceCard() {
  const attendanceSummary = [
    { label: "Present", value: 5 },
    { label: "Absent", value: 0 },
    { label: "Late In", value: 1 },
    { label: "Early Out", value: 0 },
    { label: "Penalty", value: 0 },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="pb-3 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-800">My Attendance</h2>
      </div>

      <div className="divide-y divide-slate-100 text-xs font-medium text-slate-600 mt-1 flex-1 flex flex-col justify-between">
        {attendanceSummary.map((item, index) => (
          <div key={index} className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 font-medium">{item.label}</span>
            <span className="font-bold text-slate-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}