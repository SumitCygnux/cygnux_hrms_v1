import Badge from "../../../../components/common/Badge";

const MyLeaveHistory = ({ leaves }) => {
  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 mb-7">
      <h3 className="font-bold text-lg text-text-primary mb-5">
        My Leave History
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-color">
              <th className="text-left py-3 text-sm text-text-secondary">
                Leave Type
              </th>

              <th className="text-left py-3 text-sm text-text-secondary">
                Start Date
              </th>

              <th className="text-left py-3 text-sm text-text-secondary">
                End Date
              </th>
              <th className="text-left py-3 text-sm text-text-secondary">
                Days
              </th>
              <th className="text-left py-3 text-sm text-text-secondary">
                Reason
              </th>

              <th className="text-left py-3 text-sm text-text-secondary">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
                {leaves.length > 0 ? (
              leaves.map((leave) => {
        
                const totalDays = leave.fromDate && leave.toDate
                  ? Math.ceil((new Date(leave.toDate) - new Date(leave.fromDate))) / (1000 * 60 * 60 * 24) + 1 
                  : 0; 
                return (
                  <tr key={leave.id} className="border-b border-border-color hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 text-text-primary font-medium">{leave.leaveType}</td>
                    <td className="py-3 text-text-primary">{leave.fromDate}</td>
                    <td className="py-3 text-text-primary">{leave.toDate}</td>
                    
                  
                    <td className="py-3 text-text-primary font-semibold">
                      {totalDays} {totalDays === 1 ? "Day" : "Days"}
                    </td>

                    <td className="py-3 text-text-primary max-w-xs truncate">
                      {leave.reason || "-"}
                    </td>
                    <td className="py-3">
                      <Badge status={leave.status}>{leave.status}</Badge>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5 text-gray-400">
                  No leave history found.
                </td>
              </tr> 
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyLeaveHistory;
