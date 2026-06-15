import { useState, useMemo } from "react";
import { useHRMSData } from "../../context/HRMSDataContext";
import PageHeader from "../../components/layout/PageHeader";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Avatar from "../../components/common/Avatar";
import DetailModal from "../../components/modals/DetailModal";
import { PieChartComponent, AreaChartComponent } from "../../components/charts/ChartWrappers";
import {
  MdPayments,
  MdCheckCircle,
  MdHourglassEmpty,
  MdReceipt,
  MdLocalPrintshop,
  MdVisibility,
  MdCheck
} from "react-icons/md";

const Payroll = () => {
  const { employees, updateEmployee } = useHRMSData();

  const [selectedEmp, setSelectedEmp] = useState(null);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);

  // Stats Calculations
  const stats = useMemo(() => {
    let total = 0;
    let processed = 0;
    let pending = 0;
    let tax = 0;

    employees.forEach((emp) => {
      if (emp.payroll) {
        total += emp.payroll.net;
        tax += emp.payroll.tax;
        if (emp.payroll.status === "Processed") {
          processed += emp.payroll.net;
        } else {
          pending += emp.payroll.net;
        }
      }
    });

    return { total, processed, pending, tax };
  }, [employees]);

  // Chart data
  const deptPayrollData = useMemo(() => {
    const sum = {};
    employees.forEach((emp) => {
      if (emp.payroll) {
        sum[emp.department] = (sum[emp.department] || 0) + emp.payroll.net;
      }
    });
    return Object.keys(sum).map((d) => ({
      name: d,
      value: sum[d]
    }));
  }, [employees]);

  const monthlyTrendData = [
    { name: "Jan", value: 65000 },
    { name: "Feb", value: 68000 },
    { name: "Mar", value: 71000 },
    { name: "Apr", value: 71500 },
    { name: "May", value: 72000 },
    { name: "Jun", value: stats.total }
  ];

  const handleProcessPayroll = (id, payrollInfo) => {
    updateEmployee(id, {
      payroll: {
        ...payrollInfo,
        status: "Processed"
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

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
      header: "Basic Salary",
      accessor: "payroll.basic",
      sortable: true,
      render: (row) => `$${row.payroll?.basic.toLocaleString()}`
    },
    {
      header: "Allowances",
      accessor: "payroll.allowances",
      sortable: true,
      render: (row) => `$${row.payroll?.allowances.toLocaleString()}`
    },
    {
      header: "Deductions",
      accessor: "payroll.deductions",
      sortable: true,
      render: (row) => `$${row.payroll?.deductions.toLocaleString()}`
    },
    {
      header: "Net Salary",
      accessor: "payroll.net",
      sortable: true,
      render: (row) => `$${row.payroll?.net.toLocaleString()}`
    },
    {
      header: "Status",
      accessor: "payroll.status",
      sortable: true,
      render: (row) => <Badge status={row.payroll?.status}>{row.payroll?.status}</Badge>
    },
    {
      header: "Actions",
      accessor: "actions",
      sortable: false,
      render: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedEmp(row);
              setIsPayslipOpen(true);
            }}
            iconBefore={<MdVisibility className="text-lg" />}
            aria-label="View Payslip"
          />
          {row.payroll?.status === "Pending" && (
            <Button
              size="sm"
              variant="success"
              iconBefore={<MdCheck />}
              onClick={() => handleProcessPayroll(row.id, row.payroll)}
            >
              Process
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader title="Payroll Dashboard" subtitle="Manage salaries, bonuses, and tax deductions" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">Total Payroll Value</span>
            <span className="text-3xl font-extrabold text-text-primary">${stats.total.toLocaleString()}</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-primary-light text-primary">
            <MdPayments />
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">Processed Payroll</span>
            <span className="text-3xl font-extrabold text-success">
              ${stats.processed.toLocaleString()}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-success-light text-success">
            <MdCheckCircle />
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">Pending Payroll</span>
            <span className="text-3xl font-extrabold text-warning">
              ${stats.pending.toLocaleString()}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-warning-light text-warning">
            <MdHourglassEmpty />
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase">Tax Deductions</span>
            <span className="text-3xl font-extrabold text-text-primary">${stats.tax.toLocaleString()}</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-danger-light text-danger">
            <MdReceipt />
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7">
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm">
          <span className="text-base font-bold text-text-primary mb-4 block">Department Salary Distribution</span>
          <PieChartComponent data={deptPayrollData} nameKey="name" valueKey="value" />
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm">
          <span className="text-base font-bold text-text-primary mb-4 block">Monthly Payroll Trend ($)</span>
          <AreaChartComponent data={monthlyTrendData} xKey="name" yKey="value" color="#2563EB" />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-bg-secondary border border-border-color rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-lg text-gray-800">Payroll Cycle Table</h3>
        </div>
        <DataTable columns={columns} data={employees} pageSize={8} emptyMessage="No payroll configurations found." />
      </div>

      {/* Payslip Modal */}
      <DetailModal
        isOpen={isPayslipOpen}
        onClose={() => setIsPayslipOpen(false)}
        title="Payslip Details"
        maxWidth="600px"
        footer={
          <div className="flex justify-between w-full">
            <Button variant="secondary" iconBefore={<MdLocalPrintshop />} onClick={handlePrint}>
              Print Payslip
            </Button>
            <Button variant="primary" onClick={() => setIsPayslipOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedEmp && (
          <div className="flex flex-col gap-6 p-4 border border-gray-200 rounded-md">
            <div className="flex justify-between border-b border-gray-300 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">CYGNUX HRMS</h2>
                <p className="text-xs text-gray-500">500 Innovation Way, New York</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-gray-700">Salary Slip</h3>
                <p className="text-sm text-gray-600">June 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-sm border-b border-gray-300 pb-4">
              <div>
                <span className="text-gray-500 block">Employee ID</span>
                <span className="font-semibold text-gray-800">{selectedEmp.id}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Name</span>
                <span className="font-semibold text-gray-800">{selectedEmp.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Department</span>
                <span className="font-semibold text-gray-800">{selectedEmp.department}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Designation</span>
                <span className="font-semibold text-gray-800">{selectedEmp.designation}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-bold text-gray-700 border-b border-gray-200 pb-2">
                <span>Earnings</span>
                <span>Amount ($)</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Basic Salary</span>
                <span>{selectedEmp.payroll?.basic.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Allowances</span>
                <span>{selectedEmp.payroll?.allowances.toLocaleString()}</span>
              </div>

              <div className="flex justify-between font-bold text-gray-700 border-b border-gray-200 pb-2 mt-4">
                <span>Deductions</span>
                <span>Amount ($)</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Taxes (Simulated)</span>
                <span>{selectedEmp.payroll?.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 border-b border-gray-200 pb-2">
                <span>PF / General Deductions</span>
                <span>{selectedEmp.payroll?.deductions.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 font-extrabold text-lg border-t border-gray-300">
              <span>Net take-home Pay</span>
              <span className="text-emerald-600">${selectedEmp.payroll?.net.toLocaleString()}</span>
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  );
};

export default Payroll;
