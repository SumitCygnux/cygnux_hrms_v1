import {
  MdEventNote,
  MdCheckCircle,
  MdCancel,
  MdHourglassEmpty,
} from "react-icons/md";

import { useMemo } from "react";

const LeaveStats = ({ leaves }) => {
  const stats = useMemo(() => {
    return {
      total: leaves.length,

      approved: leaves.filter((l) => l.status === "APPROVED").length,

      rejected: leaves.filter((l) => l.status === "REJECTED").length,

      pending: leaves.filter((l) => l.status === "PENDING").length,
    };
  }, [leaves]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
      {/* Total Requests */}

      <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-text-secondary uppercase">
            Total Requests
          </span>

          <span className="text-3xl font-extrabold text-text-primary">
            {stats.total}
          </span>
        </div>

        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-primary-light text-primary">
          <MdEventNote />
        </div>
      </div>

      {/* Approved */}

      <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-text-secondary uppercase">
            Approved
          </span>

          <span className="text-3xl font-extrabold text-text-primary">
            {stats.approved}
          </span>
        </div>

        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-success-light text-success">
          <MdCheckCircle />
        </div>
      </div>

      {/* Rejected */}

      <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-text-secondary uppercase">
            Rejected
          </span>

          <span className="text-3xl font-extrabold text-text-primary">
            {stats.rejected}
          </span>
        </div>

        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-danger-light text-danger">
          <MdCancel />
        </div>
      </div>

      {/* Pending */}

      <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-text-secondary uppercase">
            Pending
          </span>

          <span className="text-3xl font-extrabold text-text-primary">
            {stats.pending}
          </span>
        </div>

        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-warning-light text-warning">
          <MdHourglassEmpty />
        </div>
      </div>
    </div>
  );
};

export default LeaveStats;
