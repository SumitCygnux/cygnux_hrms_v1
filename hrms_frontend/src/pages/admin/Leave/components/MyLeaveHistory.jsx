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
                Reason
              </th>

              <th className="text-left py-3 text-sm text-text-secondary">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {leaves.length > 0 ? (
              leaves.map((leave) => (
                <tr key={leave.id} className="border-b border-border-color">
                  <td className="py-3 text-text-primary">{leave.leaveType}</td>

                  <td className="py-3 text-text-primary">{leave.fromDate}</td>

                  <td className="py-3 text-text-primary">{leave.toDate}</td>

                  <td className="py-3 text-text-primary">
                    {leave.reason || "-"}
                  </td>

                  <td className="py-3">
                    <Badge status={leave.status}>{leave.status}</Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5 text-gray-400">
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
