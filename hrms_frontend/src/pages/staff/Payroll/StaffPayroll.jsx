import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "../../../components/layouts/PageHeader";
import Badge from "../../../components/common/Badge";
import { AreaChartComponent } from "../../../components/charts/ChartWrappers";

const currentPayroll = {
  month: "May 2026",
  basic: 11000,
  allowances: 2000,
  deductions: 1000,
  tax: 1500,
  net: 10500,
  status: "Processed",
  paidOn: "2026-05-31",
};

const payrollHistory = [
  { id: "PAY-006", month: "May 2026", gross: 13000, deductions: 2500, net: 10500, status: "Processed" },
  { id: "PAY-005", month: "Apr 2026", gross: 13000, deductions: 2500, net: 10500, status: "Processed" },
  { id: "PAY-004", month: "Mar 2026", gross: 13000, deductions: 2600, net: 10400, status: "Processed" },
  { id: "PAY-003", month: "Feb 2026", gross: 12800, deductions: 2500, net: 10300, status: "Processed" },
  { id: "PAY-002", month: "Jan 2026", gross: 12800, deductions: 2400, net: 10400, status: "Processed" },
  { id: "PAY-001", month: "Dec 2025", gross: 13500, deductions: 2500, net: 11000, status: "Processed" },
];

const netSalaryTrend = [
  { name: "Dec", value: 11000 },
  { name: "Jan", value: 10400 },
  { name: "Feb", value: 10300 },
  { name: "Mar", value: 10400 },
  { name: "Apr", value: 10500 },
  { name: "May", value: 10500 },
];

const inr = (n) => `₹${Math.abs(n).toLocaleString("en-IN")}`;

const StaffPayroll = () => {
  const [, setSelectedSlip] = useState(null);

  const breakdown = [
    { label: "Basic Salary", amount: currentPayroll.basic, type: "credit" },
    { label: "Allowances", amount: currentPayroll.allowances, type: "credit" },
    { label: "Gross Salary", amount: currentPayroll.basic + currentPayroll.allowances, type: "total" },
    { label: "Deductions (PF / Other)", amount: -currentPayroll.deductions, type: "debit" },
    { label: "Tax (TDS)", amount: -currentPayroll.tax, type: "debit" },
    { label: "Net Pay", amount: currentPayroll.net, type: "net" },
  ];

  return (
    <div>
      <PageHeader
        title="My Payroll"
        subtitle="View your salary breakdowns and download pay slips"
      />

      {/* Current Month Payslip Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 rounded-[24px] p-7 text-white shadow-[0_20px_60px_rgba(37,99,235,0.25)] mb-7 relative overflow-hidden"
      >
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute right-16 bottom-0 w-20 h-20 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
                Current Payslip
              </p>
              <h2 className="text-3xl font-extrabold mb-1">{inr(currentPayroll.net)}</h2>
              <p className="text-white/70 text-sm">Net Pay · {currentPayroll.month}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2.5 py-1 bg-white/15 rounded-full text-xs font-semibold">
                  {currentPayroll.status}
                </span>
                <span className="text-white/60 text-xs">Paid on {currentPayroll.paidOn}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Basic", value: inr(currentPayroll.basic) },
                { label: "Allowances", value: inr(currentPayroll.allowances) },
                {
                  label: "Deductions",
                  value: `-${inr(currentPayroll.deductions + currentPayroll.tax)}`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/10 rounded-xl px-4 py-3 text-center border border-white/10"
                >
                  <p className="text-white/60 text-xs mb-1">{item.label}</p>
                  <p className="text-white font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-7">
        {/* Salary Breakdown */}
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6">
          <p className="text-base font-bold text-slate-800 mb-1">
            Salary Breakdown — {currentPayroll.month}
          </p>
          <p className="text-xs text-slate-400 mb-5">gross net totel</p>
          <div className="flex flex-col gap-3">
            {breakdown.map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  item.type === "net"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : item.type === "total"
                    ? "bg-slate-100"
                    : "bg-slate-50/60 border border-slate-100"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${
                    item.type === "net" ? "text-white" : "text-slate-700"
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`text-sm font-bold ${
                    item.type === "net"
                      ? "text-white"
                      : item.type === "debit"
                      ? "text-danger"
                      : item.type === "total"
                      ? "text-slate-800"
                      : "text-success"
                  }`}
                >
                  {item.amount < 0 ? `-${inr(item.amount)}` : inr(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Net Salary Trend */}
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6">
          <p className="text-base font-bold text-slate-800 mb-1">Net Salary Trend</p>
          <p className="text-xs text-slate-400 mb-4">Last 6 months net take-home pay (₹)</p>
          <AreaChartComponent data={netSalaryTrend} xKey="name" yKey="value" color="#22C55E" />
        </div>
      </div>

      {/* Payroll History */}
      <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <p className="text-base font-bold text-slate-800">Payroll History</p>
          <p className="text-xs text-slate-400 mt-0.5">{payrollHistory.length} processed payslips</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Month", "Gross Salary", "Total Deductions", "Net Pay", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {payrollHistory.map((pay, idx) => (
                <motion.tr
                  key={pay.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5 font-semibold text-slate-700">{pay.month}</td>
                  <td className="px-5 py-3.5 text-slate-600">{inr(pay.gross)}</td>
                  <td className="px-5 py-3.5 text-danger font-medium">-{inr(pay.deductions)}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-800">{inr(pay.net)}</td>
                  <td className="px-5 py-3.5">
                    <Badge status={pay.status}>{pay.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setSelectedSlip(pay.id)}
                      className="text-xs font-bold text-primary hover:text-primary-hover uppercase tracking-wide transition-all"
                    >
                      Download
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffPayroll;
