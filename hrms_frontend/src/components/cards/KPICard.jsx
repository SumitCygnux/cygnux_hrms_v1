import { motion } from "framer-motion";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";

const KPICard = ({ title, value, icon, trend, trendType = "up" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-slate-100 rounded-[24px] p-6 flex justify-between items-start shadow-[0_12px_40px_rgba(0,0,0,0.03)] transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] hover:border-blue-500/30 group"
    >
      <div className="flex flex-col gap-2 relative z-10">
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{title}</span>
        <span className="text-3xl font-extrabold text-slate-800 leading-none">{value}</span>
        {trend && (
          <div
            className={`inline-flex items-center text-xs font-semibold gap-1 mt-1 ${
              trendType === "up" ? "text-emerald-600" : "text-rose-500"
            }`}
          >
            {trendType === "up" ? <MdTrendingUp /> : <MdTrendingDown />}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white relative z-10 shadow-sm shadow-blue-100/30">
        {icon}
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/10 to-transparent pointer-events-none" />
    </motion.div>
  );
};

export default KPICard;
