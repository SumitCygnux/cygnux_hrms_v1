import { useState } from "react";
import { useHRMSData } from "../../../context/HRMSDataContext";
import PageHeader from "../../../components/layouts/PageHeader";
import Tabs from "../../../components/common/Tabs";
import Button from "../../../components/common/Button";
import Badge from "../../../components/common/Badge";
import { MdDone } from "react-icons/md";
const Settings = () => {
  const {
    companySettings,
    updateSettings,
    leavePolicies,
    payrollPolicies
  } = useHRMSData();

  const [activeTab, setActiveTab] = useState("company");


  // Local Form state for Company
  const [compForm, setCompForm] = useState({ ...companySettings });

  const tabs = [
    { id: "company", label: "Company Settings" },
    { id: "roles", label: "Roles & Permissions" },
    { id: "leave", label: "Leave Policies" },
    { id: "payroll", label: "Payroll Rules" },
    { id: "notifications", label: "Notification Settings" }
  ];

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    updateSettings(compForm);
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure platform rules, policies, and account setups" />

      <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm min-h-[480px]">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Company Settings */}
        {activeTab === "company" && (
          <form onSubmit={handleCompanySubmit}>
            <h3 className="text-base font-bold text-text-primary mb-5 pb-2 border-b border-border-color">Company Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">Company Name</label>
                <input
                  type="text"
                  value={compForm.companyName}
                  onChange={(e) => setCompForm({ ...compForm, companyName: e.target.value })}
                  className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">Official Email</label>
                <input
                  type="email"
                  value={compForm.companyEmail}
                  onChange={(e) => setCompForm({ ...compForm, companyEmail: e.target.value })}
                  className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">Contact Phone</label>
                <input
                  type="tel"
                  value={compForm.companyPhone}
                  onChange={(e) => setCompForm({ ...compForm, companyPhone: e.target.value })}
                  className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">Base Currency</label>
                <select
                  value={compForm.currency}
                  onChange={(e) => setCompForm({ ...compForm, currency: e.target.value })}
                  className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary transition-all"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">Standard Timezone</label>
                <select
                  value={compForm.timezone}
                  onChange={(e) => setCompForm({ ...compForm, timezone: e.target.value })}
                  className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary transition-all"
                >
                  <option value="UTC-5 (EST)">UTC-5 (EST)</option>
                  <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                  <option value="UTC+5:30 (IST)">UTC+5:30 (IST)</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">Office Address</label>
                <textarea
                  rows="3"
                  value={compForm.address}
                  onChange={(e) => setCompForm({ ...compForm, address: e.target.value })}
                  className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button type="submit" variant="primary">
                Save Profile Changes
              </Button>
            </div>
          </form>
        )}

        {/* Roles & Permissions */}
        {activeTab === "roles" && (
          <div>
            <h3 className="text-base font-bold text-text-primary mb-5 pb-2 border-b border-border-color">Access Control Levels</h3>
            <table className="w-full border-collapse mt-3 text-sm">
              <thead>
                <tr>
                  <th className="py-3 px-4 font-bold text-text-secondary border-b-2 border-border-color text-left">Module Profile</th>
                  <th className="py-3 px-4 font-bold text-text-secondary border-b-2 border-border-color text-left">Admin Access</th>
                  <th className="py-3 px-4 font-bold text-text-secondary border-b-2 border-border-color text-left">HR Access</th>
                  <th className="py-3 px-4 font-bold text-text-secondary border-b-2 border-border-color text-left">Employee Access</th>
                </tr>
              </thead>
              <tbody>
                {["Staff Management", "Attendance", "Leave", "Payroll", "Recruitment", "Settings"].map((mod) => (
                  <tr key={mod}>
                    <td className="py-3 px-4 border-b border-border-color text-text-primary" style={{ fontWeight: "700" }}>{mod}</td>
                    <td className="py-3 px-4 border-b border-border-color text-text-primary">
                      <span className="flex items-center text-emerald-500 font-bold gap-1">
                        <MdDone /> Full Access
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b border-border-color text-text-primary">
                      {mod === "Settings" || mod === "Payroll" ? (
                        <span className="text-gray-400 font-semibold">View Only</span>
                      ) : (
                        <span className="flex items-center text-emerald-500 font-bold gap-1">
                          <MdDone /> Write Access
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 border-b border-border-color text-text-primary">
                      {mod === "Staff Management" || mod === "Attendance" || mod === "Leave" ? (
                        <span className="text-gray-400 font-semibold">Self Only</span>
                      ) : (
                        <span className="text-red-500 font-bold">No Access</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Leave Policies */}
        {activeTab === "leave" && (
          <div>
            <h3 className="text-base font-bold text-text-primary mb-5 pb-2 border-b border-border-color">Company Leave Configurations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
              {leavePolicies.map((p) => (
                <div key={p.id} className="bg-bg-primary border border-border-color rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                  <div className="flex justify-between items-center font-bold text-sm text-text-primary">
                    <span>{p.type}</span>
                    <Badge status="WFH">{p.allowance} Days / yr</Badge>
                  </div>
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>Accrual Cycle:</span>
                    <span className="font-semibold text-gray-800">{p.accrual}</span>
                  </div>
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>Carry Over:</span>
                    <span className="font-semibold text-gray-800">{p.carryOver ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payroll Rules */}
        {activeTab === "payroll" && (
          <div>
            <h3 className="text-base font-bold text-text-primary mb-5 pb-2 border-b border-border-color">Financial Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
              <div className="bg-bg-primary border border-border-color rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                <div className="font-bold text-sm text-gray-700">PF contribution Rate</div>
                <div className="text-2xl font-extrabold text-blue-500 mt-2">{payrollPolicies.pfContribution}%</div>
                <div className="text-xs text-gray-500 mt-1">Deducted from gross base salary monthly</div>
              </div>

              <div className="bg-bg-primary border border-border-color rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                <div className="font-bold text-sm text-gray-700">Standard Working Hours</div>
                <div className="text-2xl font-extrabold text-blue-500 mt-2">{payrollPolicies.standardWorkingHours} Hours / mo</div>
                <div className="text-xs text-gray-500 mt-1">Required check-ins to avoid salary deduction</div>
              </div>

              <div className="bg-bg-primary border border-border-color rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                <div className="font-bold text-sm text-gray-700">Overtime Multiplier</div>
                <div className="text-2xl font-extrabold text-blue-500 mt-2">{payrollPolicies.overtimeRate}x</div>
                <div className="text-xs text-gray-500 mt-1">Hourly rate calculation for extra logs</div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <div>
            <h3 className="text-base font-bold text-text-primary mb-5 pb-2 border-b border-border-color">Email & Alert Triggers</h3>
            <div className="flex flex-col gap-4 mt-4">
              {[
                "Send email alert on new leave application request",
                "Notify HR on new recruitment candidate submission",
                "Generate notifications for completed monthly payroll",
                "Send weekly attendance digests to department managers",
                "Notify employee on profile data updates"
              ].map((opt, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-gray-700">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
