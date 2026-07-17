import { useMemo } from "react";
import { motion } from "framer-motion";

const totalLeaves = {
  "Sick Leave":4,
  "Casual Leave":4,
  "Paid Leave": 4,
};
const EmployeeLeaveStats = ({ leaves }) => {
  const leaveBalance = useMemo(() => {
    return Object.keys(totalLeaves).map((type) => {
      const used = leaves
      
        .filter((l) => 
          l.leaveType && 
          l.leaveType.toLowerCase().trim() === type.toLowerCase().trim() && 
          l.status === "APPROVED"
        )
        .reduce((sum, l) => { 
          const days =
            Math.ceil(
              (new Date(l.toDate) - new Date(l.fromDate)) /
                (1000 * 60 * 60 * 24),
            ) + 1;

          return sum + days;
        }, 0);

      return {
        leaveType: type,
        total: totalLeaves[type],
        used,
      };
    });
  }, [leaves]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
      
      {leaveBalance.map((lb, i) => {
     
         const remaining = Math.max(0, lb.total - lb.used);
   
 const pct = Math.min(100, Math.round((lb.used / lb.total) * 100));
        return (
      
          <motion.div
            key={lb.leaveType}
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: i * 0.08,
            }}
            className="bg-white border border-slate-100 border-l-4 border-l-primary rounded-[24px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)]"
          >
            <div className="flex justify-between mb-3">
              <p className="text-xs text-slate-400 font-bold uppercase">
                {lb.leaveType}
              </p>

              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                remaining === 0 ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-500"
              }`}>
                {remaining} of {lb.total} left
              </span>
            </div>
       
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-extrabold text-slate-800">
                {lb.used}
              </p>
              <span className="text-sm font-semibold text-slate-400">Used</span>
            </div>
            
            <div className="w-full h-2 bg-slate-100 rounded-full mt-4">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  pct >= 100 ? "bg-red-500" : "bg-primary"
                }`} 
                style={{
                  width: `${pct}%`,
                }}
              />
            </div>
              
            <p className="text-[10px] text-slate-400 mt-2">
              {pct}% of quota consumed
              {lb.used >= lb.total && (
                <span className="text-red-500 font-bold block mt-1">
                   No more {lb.leaveType} allowed!!
                </span>
              )}
            </p> 
          </motion.div>
        );
      })}

    </div>
  );
};

export default EmployeeLeaveStats;
