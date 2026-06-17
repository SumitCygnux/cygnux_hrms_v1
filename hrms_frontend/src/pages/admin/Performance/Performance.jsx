import { useMemo } from "react";
import { useHRMSData } from "../../../context/HRMSDataContext";
import PageHeader from "../../../components/layouts/PageHeader";
import DataTable from "../../../components/tables/DataTable";
import Badge from "../../../components/common/Badge";
import Avatar from "../../../components/common/Avatar";
import { BarChartComponent } from "../../../components/charts/ChartWrappers";
import { MdStar, MdTimeline, MdAssignmentTurnedIn, MdWorkspacePremium, MdHelpOutline } from "react-icons/md";

const Performance = () => {
  const { employees } = useHRMSData();

  // Performance calculations
  const stats = useMemo(() => {
    let active = 0;
    let completed = 0;
    let pending = 0;

    employees.forEach((emp) => {
      if (emp.performance) {
        if (emp.performance.reviewStatus === "Active Reviews") active += 1;
        else if (emp.performance.reviewStatus === "Pending Reviews") pending += 1;
        else completed += 1;
      }
    });

    return { active, completed, pending };
  }, [employees]);

  // Leaderboard data
  const leaderboard = useMemo(() => {
    return [...employees]
      .filter((e) => e.performance)
      .sort((a, b) => b.performance.kpiScore - a.performance.kpiScore)
      .slice(0, 4);
  }, [employees]);

  // Goal Progress values
  const goals = [
    { title: "Deliver Frontend Platform", progress: 90 },
    { title: "Improve Customer Response Time", progress: 75 },
    { title: "Optimize Database Queries", progress: 60 },
    { title: "Hire Tech Recruiting Lead", progress: 100 }
  ];

  // Ratings chart data
  const chartData = [
    { name: "1.0 - 2.0 Star", value: employees.filter((e) => e.performance?.rating < 2.0).length },
    { name: "2.0 - 3.0 Star", value: employees.filter((e) => e.performance?.rating >= 2.0 && e.performance?.rating < 3.0).length },
    { name: "3.0 - 4.0 Star", value: employees.filter((e) => e.performance?.rating >= 3.0 && e.performance?.rating < 4.0).length },
    { name: "4.0 - 5.0 Star", value: employees.filter((e) => e.performance?.rating >= 4.0).length }
  ];

  // Columns
  const columns = [
    {
      header: "Employee",
      accessor: "name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} color={row.avatarColor} size={36} />
          <div className="flex flex-col">
            <span className="font-semibold text-text-primary">{row.name}</span>
            <span className="text-xs text-text-secondary">{row.id}</span>
          </div>
        </div>
      )
    },
    { header: "Department", accessor: "department", sortable: true },
    {
      header: "KPI Score",
      accessor: "performance.kpiScore",
      sortable: true,
      render: (row) => `${row.performance?.kpiScore} / 100`
    },
    {
      header: "Rating",
      accessor: "performance.rating",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          <MdStar className="text-yellow-500" />
          <span>{row.performance?.rating.toFixed(1)}</span>
        </div>
      )
    },
    {
      header: "Status",
      accessor: "performance.reviewStatus",
      sortable: true,
      render: (row) => <Badge status={row.performance?.reviewStatus}>{row.performance?.reviewStatus}</Badge>
    }
  ];

  return (
    <div>
      <PageHeader title="Performance appraisals" subtitle="Manage reviews, objectives, and team standings" />

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">Active Reviews</span>
            <span className="text-3xl font-extrabold text-text-primary">{stats.active}</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-primary-light text-primary">
            <MdTimeline />
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">Completed Reviews</span>
            <span className="text-3xl font-extrabold text-success">
              {stats.completed}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-success-light text-success">
            <MdAssignmentTurnedIn />
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">Pending Reviews</span>
            <span className="text-3xl font-extrabold text-warning">
              {stats.pending}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-warning-light text-warning">
            <MdHelpOutline />
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">Top Performers</span>
            <span className="text-3xl font-extrabold text-text-primary">3</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-danger-light text-danger">
            <MdWorkspacePremium />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-7 items-start">
        {/* Left Column: Chart & Goals */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-text-primary mb-5">Rating Distribution</h3>
            <BarChartComponent data={chartData} xKey="name" yKey="value" color="#8B5CF6" label="Employees" />
          </div>

          <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-text-primary mb-5">Key Business Objectives</h3>
            <div className="flex flex-col gap-4">
              {goals.map((g) => (
                <div key={g.title} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-primary">{g.title}</span>
                    <span className="text-primary">{g.progress}%</span>
                  </div>
                  <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${g.progress}%`, backgroundColor: g.progress === 100 ? "var(--color-success)" : "var(--color-primary)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-text-primary mb-5">Top Performer Standings</h3>
          <div className="flex flex-col gap-3">
            {leaderboard.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-bg-primary border border-border-color rounded-lg">
                <div className="text-sm font-extrabold w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center">{index + 1}</div>
                <Avatar name={item.name} color={item.avatarColor} size={32} />
                <div>
                  <span className="font-semibold text-xs text-text-primary">{item.name}</span>
                  <span className="text-[10px] text-text-secondary block">{item.department}</span>
                </div>
                <span className="ml-auto font-extrabold text-success">{item.performance?.kpiScore}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-bg-secondary border border-border-color rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-lg text-gray-800">Appraisal Review Pipeline</h3>
        </div>
        <DataTable columns={columns} data={employees} pageSize={5} emptyMessage="No performance data available." />
      </div>
    </div>
  );
};

export default Performance;
