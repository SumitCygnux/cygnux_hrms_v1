import { motion } from "framer-motion";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";

const KPICard = ({ title, value, icon, trend, trendType = "up" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-bg-secondary border border-border-color rounded-2xl p-6 flex justify-between items-start shadow-sm transition-all duration-200 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-primary group"
    >
      <div className="flex flex-col gap-2 relative z-10">
        <span className="text-sm text-text-secondary font-semibold uppercase tracking-wider">{title}</span>
        <span className="text-3xl font-extrabold text-text-primary leading-none">{value}</span>
        {trend && (
          <div
            className={`inline-flex items-center text-xs font-semibold gap-1 mt-1 ${
              trendType === "up" ? "text-success" : "text-danger"
            }`}
          >
            {trendType === "up" ? <MdTrendingUp /> : <MdTrendingDown />}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-primary/10 text-primary transition-all duration-150 group-hover:bg-primary group-hover:text-white relative z-10">
        {icon}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_80%)] pointer-events-none" />
    </motion.div>
  );
};

export default KPICard;
