import DataTable from "../../../../components/tables/DataTable";
import Badge from "../../../../components/common/Badge";
import Avatar from "../../../../components/common/Avatar";

import LeaveActions from "./LeaveActions";

const LeaveTable = ({ leaves, employees, canApprove, handleStatusUpdate }) => {
    console.log("canApprove =>", canApprove);
  const columns = [
    {
      header: "Employee",
      accessor: "employeeName",
      sortable: true,

      render: (row) => {
        const emp = employees.find((e) => e.id === row.staffId);

        return (
          <div className="flex items-center gap-3">
            <Avatar
              name={row.employeeName}
              color={emp?.avatarColor || "#2563EB"}
              size={36}
            />

            <div className="flex flex-col">
              <span className="font-semibold text-text-primary">
                {row.employeeName}
              </span>

              <span className="text-xs text-text-secondary">
                ID: {row.staffId}
              </span>
            </div>
          </div>
        );
      },
    },

    {
      header: "Leave Type",
      accessor: "leaveType",
      sortable: true,
    },

    {
      header: "Start Date",
      accessor: "fromDate",
      sortable: true,
    },

    {
      header: "End Date",
      accessor: "toDate",
      sortable: true,
    },

    {
      header: "Total Days",
      accessor: "totalDays",
      sortable: true,

      render: (row) =>
        `${
          Math.ceil(
            (new Date(row.toDate) - new Date(row.fromDate)) /
              (1000 * 60 * 60 * 24),
          ) + 1
        } Days`,
    },

    {
      header: "Reason",
      accessor: "reason",
      sortable: false,

      render: (row) => row.reason || "No reason provided.",
    },

    {
      header: "Status",
      accessor: "status",
      sortable: true,

      render: (row) => <Badge status={row.status}>{row.status}</Badge>,
    },

    {
      header: "Actions",
      accessor: "actions",
      sortable: false,

      render: (row) => {
        if (row.status !== "PENDING")
          return (
            <span className="text-gray-400 text-xs font-semibold">
              Processed
            </span>
          );

        return (
          canApprove && (
            <LeaveActions id={row.id} handleStatusUpdate={handleStatusUpdate} />
          )
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={leaves}
      pageSize={5}
      emptyMessage="No leave requests filed."
    />
  );
};

export default LeaveTable;
