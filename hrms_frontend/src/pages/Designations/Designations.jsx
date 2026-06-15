import { useState } from "react";
import { useHRMSData } from "../../context/HRMSDataContext";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import DetailModal from "../../components/modals/DetailModal";
import { MdAdd } from "react-icons/md";

const Designations = () => {
  const { designations, departments } = useHRMSData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    department: "Engineering",
    grade: "L1",
    baseSalary: 60000
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Static addition (visual mock)
    setIsModalOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Designations"
        subtitle="Manage company role templates, grades and base compensations"
        actions={
          <Button variant="primary" iconBefore={<MdAdd />} onClick={() => setIsModalOpen(true)}>
            Add Designation
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {designations.map((desg) => (
          <div key={desg.id} className="bg-bg-secondary border border-border-color rounded-lg p-5 shadow-sm flex flex-col gap-3 transition-all duration-150 hover:border-primary hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-text-primary leading-tight">{desg.name}</span>
                <span className="text-xs text-text-secondary font-medium">{desg.department}</span>
              </div>
              <Badge status="WFH">{desg.grade}</Badge>
            </div>

            <div className="flex justify-between items-center mt-2 border-t border-border-color pt-3 text-sm">
              <span className="text-text-secondary">Base Salary</span>
              <span className="font-bold text-text-primary">${desg.baseSalary.toLocaleString()} / yr</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Designation"
        maxWidth="450px"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Designation Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Lead QA Engineer"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Grade / Level</label>
              <input
                type="text"
                placeholder="e.g. L3"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Base Salary ($ / yr)</label>
              <input
                type="number"
                value={formData.baseSalary}
                onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Designation
            </Button>
          </div>
        </form>
      </DetailModal>
    </div>
  );
};

export default Designations;
