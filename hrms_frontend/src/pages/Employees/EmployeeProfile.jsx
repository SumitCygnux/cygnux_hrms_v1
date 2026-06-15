import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useHRMSData } from "../../context/HRMSDataContext";
import PageHeader from "../../components/layout/PageHeader";
import Avatar from "../../components/common/Avatar";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Tabs from "../../components/common/Tabs";
import DetailModal from "../../components/modals/DetailModal";
import {
  MdDescription,
  MdFileDownload,
  MdStar,
  MdLocalPrintshop,
  MdArrowBack
} from "react-icons/md";

const EmployeeProfile = () => {
  const { id } = useParams();
  const { employees, attendanceLogs, leaveRequests, handleClockInOut } = useHRMSData();

  const [activeTab, setActiveTab] = useState("personal");
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [selectedPayslipMonth, setSelectedPayslipMonth] = useState("May 2026");

  // Find Employee
  const employee = employees.find((emp) => emp.id === id);

  if (!employee) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4 text-text-primary">Employee Profile Not Found</h2>
        <Link to="/employees">
          <Button variant="primary" iconBefore={<MdArrowBack />}>Back to Directory</Button>
        </Link>
      </div>
    );
  }

  // Filter attendance logs for this employee
  const empLogs = attendanceLogs.filter((log) => log.employeeId === employee.id);

  // Filter leave requests for this employee
  const empLeaves = leaveRequests.filter((req) => req.employeeId === employee.id);

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "payroll", label: "Payroll & Payslips" },
    { id: "leave", label: "Leave Summary" },
    { id: "attendance", label: "Attendance Logs" },
    { id: "performance", label: "Performance Profile" },
    { id: "documents", label: "Documents" }
  ];

  const handlePrintPayslip = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Employee Profile"
        subtitle={`Viewing full records for ${employee.name}`}
        actions={
          <Link to="/employees">
            <Button variant="secondary" iconBefore={<MdArrowBack />}>
              Back to Directory
            </Button>
          </Link>
        }
      />

      {/* Header Profile Card */}
      <div className="bg-bg-secondary border border-border-color rounded-lg overflow-hidden shadow-sm">
        <div className="h-[120px] bg-gradient-to-r from-primary to-blue-500 relative" />
        <div className="px-6 pb-6 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-[60px] relative z-[2] text-center sm:text-left">
          <div className="border-4 border-bg-secondary shadow-md rounded-full overflow-hidden bg-bg-secondary">
            <Avatar name={employee.name} color={employee.avatarColor} size={110} />
          </div>
          <div className="flex-1 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-3 sm:gap-0 w-full">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-extrabold text-text-primary leading-[1.2]">{employee.name}</h2>
              <span className="text-sm text-text-secondary font-medium">
                {employee.designation} | {employee.department}
              </span>
            </div>
            <div>
              <Badge status={employee.status}>{employee.status}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Sidebar Info */}
        <div className="bg-bg-secondary border border-border-color rounded-lg p-6 shadow-sm flex flex-col gap-5">
          <div className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-color pb-2">Contact Information</div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary font-medium">Email</span>
            <span className="text-text-primary font-semibold text-xs break-all text-right max-w-[200px]">{employee.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary font-medium">Phone</span>
            <span className="text-text-primary font-semibold">{employee.phone}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary font-medium">Address</span>
            <span className="text-text-primary font-semibold text-right text-xs max-w-[180px]">
              {employee.address || "N/A"}
            </span>
          </div>

          <div className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-color pb-2">Emergency Contact</div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary font-medium">Name</span>
            <span className="text-text-primary font-semibold">{employee.emergencyContact?.name || "N/A"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary font-medium">Relation</span>
            <span className="text-text-primary font-semibold">{employee.emergencyContact?.relationship || "N/A"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary font-medium">Phone</span>
            <span className="text-text-primary font-semibold">{employee.emergencyContact?.phone || "N/A"}</span>
          </div>

          <div className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-color pb-2">Operations</div>
          <Button variant="outline" size="sm" onClick={() => handleClockInOut(employee.id)}>
            Simulate Clock In/Out
          </Button>
        </div>

        {/* Main Tabbed Card */}
        <div className="bg-bg-secondary border border-border-color rounded-lg p-6 shadow-sm min-h-[500px]">
          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Personal Info Tab */}
          {activeTab === "personal" && (
            <div className="flex flex-col gap-6">
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-color pb-2">Identity Details</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between text-sm border-b border-border-color/50 pb-2">
                  <span className="text-text-secondary font-medium">Date of Birth</span>
                  <span className="text-text-primary font-semibold">{employee.dateOfBirth}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-border-color/50 pb-2">
                  <span className="text-text-secondary font-medium">Gender</span>
                  <span className="text-text-primary font-semibold">{employee.gender}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-border-color/50 pb-2">
                  <span className="text-text-secondary font-medium">Role Profile</span>
                  <span className="text-text-primary font-semibold">{employee.role}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-border-color/50 pb-2">
                  <span className="text-text-secondary font-medium">Employee ID</span>
                  <span className="text-text-primary font-semibold">{employee.id}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payroll Tab */}
          {activeTab === "payroll" && (
            <div className="flex flex-col gap-6">
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-color pb-2">Salary Structure</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between text-sm border-b border-border-color/50 pb-2">
                  <span className="text-text-secondary font-medium">Basic Salary</span>
                  <span className="text-text-primary font-semibold">${employee.payroll?.basic.toLocaleString()} / mo</span>
                </div>
                <div className="flex justify-between text-sm border-b border-border-color/50 pb-2">
                  <span className="text-text-secondary font-medium">Allowances</span>
                  <span className="text-text-primary font-semibold">${employee.payroll?.allowances.toLocaleString()} / mo</span>
                </div>
                <div className="flex justify-between text-sm border-b border-border-color/50 pb-2">
                  <span className="text-text-secondary font-medium">Deductions</span>
                  <span className="text-text-primary font-semibold">${employee.payroll?.deductions.toLocaleString()} / mo</span>
                </div>
                <div className="flex justify-between text-sm border-t border-dashed border-border-color pt-3 mt-1 col-span-1 sm:col-span-2">
                  <span className="text-text-secondary font-bold">Net Salary</span>
                  <span className="text-success font-extrabold text-base">
                    ${employee.payroll?.net.toLocaleString()} / mo
                  </span>
                </div>
              </div>

              <div className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-color pb-2 mt-6">Generated Payslips</div>
              <div className="flex flex-col gap-3">
                {["May 2026", "April 2026", "March 2026"].map((month) => (
                  <div key={month} className="flex justify-between items-center p-3 bg-bg-primary rounded-md border border-border-color">
                    <span className="font-semibold text-sm text-text-primary">{month}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedPayslipMonth(month);
                          setIsPayslipOpen(true);
                        }}
                      >
                        Preview Payslip
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leave Summary Tab */}
          {activeTab === "leave" && (
            <div className="flex flex-col gap-6">
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-color pb-2">Available Allowances</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-bg-primary border border-border-color rounded-md p-4 text-center flex flex-col gap-2">
                  <span className="text-xs font-semibold text-text-secondary">Sick Leave</span>
                  <span className="text-2xl font-extrabold text-text-primary">
                    {employee.leaveBalance.sick - employee.leaveBalance.sickUsed}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    Used: {employee.leaveBalance.sickUsed} / {employee.leaveBalance.sick} Days
                  </span>
                </div>
                <div className="bg-bg-primary border border-border-color rounded-md p-4 text-center flex flex-col gap-2">
                  <span className="text-xs font-semibold text-text-secondary">Casual Leave</span>
                  <span className="text-2xl font-extrabold text-text-primary">
                    {employee.leaveBalance.casual - employee.leaveBalance.casualUsed}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    Used: {employee.leaveBalance.casualUsed} / {employee.leaveBalance.casual} Days
                  </span>
                </div>
                <div className="bg-bg-primary border border-border-color rounded-md p-4 text-center flex flex-col gap-2">
                  <span className="text-xs font-semibold text-text-secondary">Paid Leave</span>
                  <span className="text-2xl font-extrabold text-text-primary">
                    {employee.leaveBalance.paid - employee.leaveBalance.paidUsed}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    Used: {employee.leaveBalance.paidUsed} / {employee.leaveBalance.paid} Days
                  </span>
                </div>
              </div>

              <div className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-color pb-2 mt-6">Request History</div>
              <div className="flex flex-col gap-3">
                {empLeaves.length === 0 ? (
                  <p className="text-sm text-text-muted">No leave requests filed yet.</p>
                ) : (
                  empLeaves.map((leave) => (
                    <div key={leave.id} className="flex justify-between items-center p-3 bg-bg-primary rounded-md border border-border-color">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-text-primary">{leave.leaveType}</span>
                        <span className="text-xs text-text-muted">
                          {leave.startDate} to {leave.endDate} ({leave.totalDays} Days)
                        </span>
                      </div>
                      <Badge status={leave.status}>{leave.status}</Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="flex flex-col gap-6">
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-color pb-2">Clock Logs (Simulated)</div>
              <div className="flex flex-col gap-3">
                {empLogs.length === 0 ? (
                  <p className="text-sm text-text-muted">No attendance clock events recorded today.</p>
                ) : (
                  empLogs.map((log) => (
                    <div key={log.id} className="flex justify-between items-center p-3 bg-bg-primary rounded-md border border-border-color">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-text-primary">{log.date}</span>
                        <span className="text-xs text-text-muted">
                          {log.checkIn ? `In: ${log.checkIn}` : "Missing In"}{" "}
                          {log.checkOut ? ` | Out: ${log.checkOut}` : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-text-primary">{log.hours} Hours</span>
                        <Badge status={log.status}>{log.status}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === "performance" && (
            <div className="flex flex-col gap-6">
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-color pb-2">Appraisal Summary</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between text-sm border-b border-border-color/50 pb-2">
                  <span className="text-text-secondary font-medium">KPI Score</span>
                  <span className="text-text-primary font-semibold">{employee.performance.kpiScore} / 100</span>
                </div>
                <div className="flex justify-between text-sm border-b border-border-color/50 pb-2">
                  <span className="text-text-secondary font-medium">Average Star Rating</span>
                  <span className="text-text-primary font-semibold flex items-center gap-1">
                    <MdStar className="text-yellow-500 text-base" />
                    {employee.performance.rating} / 5.0
                  </span>
                </div>
                <div className="flex justify-between text-sm border-b border-border-color/50 pb-2">
                  <span className="text-text-secondary font-medium">Review Status</span>
                  <span className="text-text-primary font-semibold">{employee.performance.reviewStatus}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-border-color/50 pb-2">
                  <span className="text-text-secondary font-medium">Completed Cycles</span>
                  <span className="text-text-primary font-semibold">{employee.performance.completedReviews} Appraisals</span>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="flex flex-col gap-6">
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-color pb-2">Internal Employee Files</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {[
                  { name: "Resume & CV.pdf", size: "2.4 MB" },
                  { name: "Offer Letter.pdf", size: "1.1 MB" },
                  { name: "NDA.pdf", size: "850 KB" }
                ].map((doc) => (
                  <div key={doc.name} className="border border-border-color rounded-md p-4 flex items-center gap-3 bg-bg-primary transition-all hover:border-primary hover:bg-bg-secondary">
                    <MdDescription className="text-3xl text-danger" />
                    <div className="flex flex-col gap-0.5 text-xs">
                      <span className="font-semibold text-text-primary">{doc.name}</span>
                      <span className="text-text-secondary">{doc.size}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      style={{ padding: "4px", marginLeft: "auto" }}
                      iconBefore={<MdFileDownload className="text-xl" />}
                      aria-label="Download Document"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payslip Modal */}
      <DetailModal
        isOpen={isPayslipOpen}
        onClose={() => setIsPayslipOpen(false)}
        title={`Payslip Preview - ${selectedPayslipMonth}`}
        maxWidth="650px"
        footer={
          <div className="flex justify-between w-full">
            <Button variant="secondary" iconBefore={<MdLocalPrintshop />} onClick={handlePrintPayslip}>
              Print Payslip
            </Button>
            <Button variant="primary" onClick={() => setIsPayslipOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        <div id="payslip-print-section" className="flex flex-col gap-6 p-4 border border-border-color rounded-md">
          {/* Header */}
          <div className="flex justify-between border-b border-border-color pb-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary">CYGNUX HRMS</h2>
              <p className="text-xs text-text-muted">500 Innovation Way, New York</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-text-secondary">Salary Slip</h3>
              <p className="text-sm text-text-primary font-medium">{selectedPayslipMonth}</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-y-2 text-sm border-b border-border-color pb-4">
            <div>
              <span className="text-text-muted block text-xs">Employee ID</span>
              <span className="font-semibold text-text-primary">{employee.id}</span>
            </div>
            <div>
              <span className="text-text-muted block text-xs">Name</span>
              <span className="font-semibold text-text-primary">{employee.name}</span>
            </div>
            <div>
              <span className="text-text-muted block text-xs">Department</span>
              <span className="font-semibold text-text-primary">{employee.department}</span>
            </div>
            <div>
              <span className="text-text-muted block text-xs">Designation</span>
              <span className="font-semibold text-text-primary">{employee.designation}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between font-bold text-text-secondary border-b border-border-color pb-2">
              <span>Earnings</span>
              <span>Amount ($)</span>
            </div>
            <div className="flex justify-between text-sm text-text-primary">
              <span>Basic Salary</span>
              <span>{employee.payroll?.basic.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-text-primary">
              <span>Allowances</span>
              <span>{employee.payroll?.allowances.toLocaleString()}</span>
            </div>

            <div className="flex justify-between font-bold text-text-secondary border-b border-border-color pb-2 mt-4">
              <span>Deductions</span>
              <span>Amount ($)</span>
            </div>
            <div className="flex justify-between text-sm text-text-primary">
              <span>Taxes (Simulated)</span>
              <span>{employee.payroll?.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-text-primary border-b border-border-color pb-2">
              <span>Deductions / PF Contribution</span>
              <span>{employee.payroll?.deductions.toLocaleString()}</span>
            </div>
          </div>

          {/* Net Pay */}
          <div className="flex justify-between items-center pt-4 font-extrabold text-lg border-t border-border-color">
            <span className="text-text-primary">Net Take-home Pay</span>
            <span className="text-emerald-600">${employee.payroll?.net.toLocaleString()}</span>
          </div>
        </div>
      </DetailModal>
    </div>
  );
};

export default EmployeeProfile;
