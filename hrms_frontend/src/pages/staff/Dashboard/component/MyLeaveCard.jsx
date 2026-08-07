import React, { useEffect, useState } from "react";
import { getLeave } from "../../../../services/api";
import { Link } from "react-router-dom";

export default function MyLeaveCard() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      const res = await getLeave();
      setLeaves(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-600";
      case "REJECTED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
     
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-slate-800">
          My Leave ({leaves.length})
        </h2>

      
         <Link to={`/leave`} className="text-xs text-blue-600 font-semibold hover:underline">
              View All
          </Link>
      </div>

      <div className="mt-3 space-y-3">
        {leaves.length > 0 ? (
          leaves.slice(0, 3).map((leave) => (
            <div
              key={leave.id}
              className="flex justify-between items-center border border-slate-100 rounded-xl p-3 hover:bg-slate-50 transition"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {leave.leaveType}
                </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(leave.fromDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-[11px] font-semibold ${getStatusColor(
                  leave.status
                )}`}
              >
                {leave.status}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-sm text-slate-500">
            No Leave Found
          </div>
        )}
      </div>
    </div>
  );
}