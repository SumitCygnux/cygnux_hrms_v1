import { useState, useEffect } from "react";
import { useHRMSData } from "../../context/HRMSDataContext";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/common/Button";
import Avatar from "../../components/common/Avatar";
import Badge from "../../components/common/Badge";
import DetailModal from "../../components/modals/DetailModal";
import { MdAdd, MdBusiness, MdEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "../../services/api";

const Departments = () => {
  const [departments, setDepartments] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    budget: 500000,
    openPositions: 1
  });

  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleEdit = (dept) => {
    setIsEdit(true);
    setSelectedId(dept.id);
    setFormData({
      name: dept.name,
      manager: dept.manager,
      budget: dept.budget,
      openPositions: dept.openPositions
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id);
      fetchDepartments();
            toast.success("Department deleted successfully! ")

    } catch (error) {
      toast.error("Department contains designations. Delete designations first")
      console.log(error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {

        await updateDepartment(
          selectedId,
          {
            name: formData.name,
            manager: formData.manager,
            budget: Number(formData.budget),
            openPositions: Number(formData.openPositions)
          }
        );

      } else {

        await createDepartment({
          name: formData.name,
          manager: formData.manager,
          budget: Number(formData.budget),
          openPositions: Number(formData.openPositions)
        });

      }
      await fetchDepartments();
      setIsModalOpen(false);

      setIsEdit(false);
      setSelectedId(null);
      setFormData({
        name: "",
        manager: "",
        budget: 500000,
        openPositions: 1
      });
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div>
      <PageHeader
        title="Departments"
        subtitle="Manage company organizational department divisions"
        actions={
          <Button variant="primary" iconBefore={<MdAdd />} onClick={() => setIsModalOpen(true)}>
            Add Department
          </Button>
        }
      />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm flex flex-col gap-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <MdBusiness className="text-2xl text-blue-500" />
                <span className="text-base font-bold text-text-primary">{dept.name}</span>
              </div>
              <Badge status="Active">Active</Badge>
            </div>

            <div className="flex items-center gap-3.5 border-b border-border-color pb-3">
              <Avatar name={dept.manager} color="#475569" size={32} />
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-secondary uppercase font-semibold">Department Head</span>
                <span className="text-xs font-semibold text-text-primary">{dept.manager}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(dept)}>
                  <MdEdit className="text-primary text-lg" />
                </button>

                <button onClick={() => handleDelete(dept.id)}>
                  <MdDelete className="text-primary text-lg" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-text-secondary">Headcount</span>
                <span className="font-bold text-text-primary">{dept.headcount}</span>
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-text-secondary">Open Roles</span>
                <span className="font-bold text-text-primary">{dept.openPositions}</span>
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-text-secondary">Budget</span>
                <span className="font-bold text-text-primary">${(dept.budget / 1000).toFixed(0)}k</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Department" title={isEdit ? "Edit Department" : "Add Department"} xWidth="450px"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Department Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Legal Affairs"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Department Head / Manager</label>
            <input
              type="text"
              required
              placeholder="e.g. Harvey Specter"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Annual Budget ($)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Open Positions</label>
              <input
                type="number"
                value={formData.openPositions}
                onChange={(e) => setFormData({ ...formData, openPositions: e.target.value })}
                className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {
                isEdit
                  ? "Update Department"
                  : "Create Department"
              }
            </Button>
          </div>
        </form>
      </DetailModal>
    </div>
  );
};

export default Departments;
