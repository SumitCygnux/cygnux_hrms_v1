import React from 'react';

export default function LateArrivalsCard({ count = 1, time = "00 H : 03 M", date = "03 Aug, 2026" }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-start">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-800">Late arrivals ({count})</h2>
        <button className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
          View <span className="text-[10px]">▶</span>
        </button>
      </div>

      {/* Content Box */}
      <div className="flex items-center justify-between border border-slate-100 p-3.5 rounded-xl bg-slate-50/50 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-blue-100 bg-blue-50 text-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{time}</p>
            <p className="text-xs text-slate-400 font-medium">Late In time</p>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-semibold">{date}</span>
      </div>
    </div>
  );
}