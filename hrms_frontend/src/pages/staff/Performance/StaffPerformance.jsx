import { motion } from "framer-motion";
import PageHeader from "../../../components/layouts/PageHeader";
import Badge from "../../../components/common/Badge";
import KPICard from "../../../components/cards/KPICard";
import { AreaChartComponent, BarChartComponent } from "../../../components/charts/ChartWrappers";
import { MdStarBorder, MdThumbUp, MdCheckCircle, MdEmojiEvents } from "react-icons/md";

const performanceData = {
  kpiScore: 95,
  rating: 4.9,
  reviewStatus: "Completed",
  completedReviews: 5,
  activeReviews: 1,
  rank: "#2 in Department",
};

const kpiTrend = [
  { name: "Q3 '25", value: 88 },
  { name: "Q4 '25", value: 91 },
  { name: "Q1 '26", value: 93 },
  { name: "Q2 '26", value: 95 },
];

const skillScores = [
  { name: "Design Quality", value: 98 },
  { name: "Collaboration", value: 92 },
  { name: "Delivery Speed", value: 88 },
  { name: "Innovation", value: 95 },
  { name: "Communication", value: 90 },
];

const reviews = [
  {
    id: "REV-001",
    period: "Q1 2026",
    type: "Quarterly Review",
    score: 93,
    rating: 4.7,
    reviewer: "Emma Watson",
    status: "Completed",
    feedback:
      "Exceptional work on the new design system. Collaboration with the engineering team was seamless.",
    date: "2026-04-01",
  },
  {
    id: "REV-002",
    period: "Q4 2025",
    type: "Annual Review",
    score: 91,
    rating: 4.6,
    reviewer: "Alex Johnson",
    status: "Completed",
    feedback:
      "Consistently delivers high-quality designs on time. Continues to raise the bar for the whole team.",
    date: "2026-01-10",
  },
  {
    id: "REV-003",
    period: "Q2 2026",
    type: "Mid-Year Review",
    score: 95,
    rating: 4.9,
    reviewer: "Emma Watson",
    status: "Active Reviews",
    feedback: "In Progress — review pending final submission.",
    date: "2026-06-15",
  },
];

const RatingBar = ({ rating }) => {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`inline-block w-3 h-3 rounded-sm ${
            i < filled ? "bg-warning" : "bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
};

const StaffPerformance = () => {
  return (
    <div>
      <PageHeader
        title="My Performance"
        subtitle="Track KPI scores, reviews, and skill assessments"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <KPICard title="KPI Score" value={`${performanceData.kpiScore}%`} icon={<MdStarBorder />} trend="Q2 2026" />
        <KPICard title="Overall Rating" value={`${performanceData.rating} / 5`} icon={<MdThumbUp />} trend="Avg across all reviews" />
        <KPICard title="Reviews Done" value={performanceData.completedReviews} icon={<MdCheckCircle />} trend="Completed this year" />
        <KPICard title="Dept. Rank" value={performanceData.rank} icon={<MdEmojiEvents />} trend="Product & Design" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-7">
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6">
          <p className="text-base font-bold text-slate-800 mb-1">KPI Score Trend</p>
          <p className="text-xs text-slate-400 mb-4">Quarterly performance score over time</p>
          <AreaChartComponent data={kpiTrend} xKey="name" yKey="value" color="#2563EB" />
        </div>

        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6">
          <p className="text-base font-bold text-slate-800 mb-1">Skill Scores</p>
          <p className="text-xs text-slate-400 mb-4">Individual skill assessment scores</p>
          <BarChartComponent
            data={skillScores}
            xKey="name"
            yKey="value"
            color="#8B5CF6"
            label="Score"
          />
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-slate-800">Review History</p>
            <p className="text-xs text-slate-400 mt-0.5">{reviews.length} reviews on record</p>
          </div>
        </div>
        <div className="flex flex-col divide-y divide-slate-50">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-5 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-bold text-slate-800 text-sm">{rev.period}</span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {rev.type}
                    </span>
                    <Badge status={rev.status}>{rev.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{rev.feedback}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-xs text-slate-400">
                      Reviewed by{" "}
                      <span className="font-semibold text-slate-600">{rev.reviewer}</span>
                    </span>
                    <span className="text-xs text-slate-400">{rev.date}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-2xl font-extrabold text-primary">{rev.score}%</div>
                  <RatingBar rating={rev.rating} />
                  <span className="text-xs text-slate-400">{rev.rating} / 5.0</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffPerformance;
