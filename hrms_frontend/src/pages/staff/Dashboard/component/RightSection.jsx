import React, { useState, useEffect } from 'react';

export default function RightSection() {
  const [workSeconds, setWorkSeconds] = useState(6932);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [status, setStatus] = useState('In');

  useEffect(() => {
    const timer = setInterval(() => {
      if (status === 'In') setWorkSeconds(prev => prev + 1);
      if (status === 'Break') setBreakSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);
  
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
   <div className="w-full lg:w-[30%] h-auto lg:h-full lg:overflow-y-auto no-scrollbar bg-white border-l border-gray-200 p-5 flex flex-col gap-6">
    
      <div className="text-center pb-6 border-b border-gray-100">
        <div className="w-20 h-20 bg-emerald-600 text-white font-bold text-2xl rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
          AV
        </div>
        <h2 className="text-lg font-bold text-gray-800">Anita Vala</h2>
        <p className="text-xs font-medium text-gray-500">Trainee</p>
      </div>

      <div className="pb-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-blue-600 rounded"></div>
          <h3 className="text-base font-bold text-gray-800">My Timing</h3>
        </div>

        <div className="border border-amber-300 rounded-xl p-4 bg-amber-50/30 mb-4">
          <div className="grid grid-cols-2 text-center divide-x divide-gray-200">
            <div className="pr-2">
              <span className="text-xs font-bold text-emerald-600 block mb-1">Current Time</span>
              <span className="text-lg font-bold font-mono text-gray-800">{formatTime(workSeconds)}</span>
            </div>
            <div className="pl-2">
              <span className="text-xs font-bold text-rose-500 block mb-1">Break Time</span>
              <span className="text-lg font-bold font-mono text-gray-800">{formatTime(breakSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setStatus(status === 'Break' ? 'In' : 'Break')}
            className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm transition-all border ${
              status === 'Break' 
                ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600' 
                : 'bg-white text-rose-500 border-rose-500 hover:bg-rose-50'
            }`}
          >
            {status === 'Break' ? 'RESUME' : 'BREAK'}
          </button>
          <button className="w-full py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-lg transition-all shadow-sm">
            CLOCK OUT
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-blue-600">📈</span>
          <h3 className="text-base font-bold text-gray-800">Attendance activity</h3>
        </div>

        <div className="border-l-2 border-gray-100 ml-2 pl-4 space-y-4">
          <div className="relative">
            <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-4 ring-white"></span>
            <p className="text-xs font-bold text-gray-800">10:02 AM</p>
            <p className="text-xs text-gray-400">Clock In</p>
          </div>
        </div>
      </div>
    </div>
  );
}