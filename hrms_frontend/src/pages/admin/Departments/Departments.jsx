import { useState, useEffect } from "react";

import PageHeader from "../../../components/layouts/PageHeader";
import Button from "../../../components/common/Button";
import Avatar from "../../../components/common/Avatar";
import Badge from "../../../components/common/Badge";
import DetailModal from "../../../components/modals/DetailModal";
import { MdAdd, MdBusiness, MdEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentHeadOptions,
} from "../../../services/api";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [headOptions, setHeadOptions] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
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
      openPositions: dept.openPositions,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id);
      fetchDepartments();
      toast.success("Department deleted successfully! ");
    } catch (error) {
      toast.error(
        "Department contains designations. Delete designations first",
      );
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
  const fetchDepartmentHeads = async () => {
    try {
      const response = await getDepartmentHeadOptions();

      console.log("HEAD OPTIONS =>", response.data);

      setHeadOptions(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDepartments();
    fetchDepartmentHeads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateDepartment(selectedId, {
          name: formData.name,
          manager: formData.manager,
          budget: Number(formData.budget),
          openPositions: Number(formData.openPositions),
        });
      } else {
        await createDepartment({
          name: formData.name,
          manager: formData.manager,
          budget: Number(formData.budget),
          openPositions: Number(formData.openPositions),
        });
      }
      await fetchDepartments();
      setIsModalOpen(false);

      setIsEdit(false);
      setSelectedId(null);
      setFormData({
        name: "",
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
          <Button
            variant="primary"
            iconBefore={<MdAdd />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Department
          </Button>
        }
      />

      {/* Grid */}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="grid grid-cols-12 bg-gray-50 px-6 py-3 border-b border-gray-200 text-sm font-semibold text-gray-600">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Department Name</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-4 text-right">Actions</div>
        </div>

        {/* Data */}
        {departments.map((dept, index) => (
          <div
            key={dept.id}
            className="grid grid-cols-12 items-center px-6 py-4 border-b border-gray-100 hover:bg-blue-50 transition"
          >
            {/* Number */}
            <div className="col-span-1 text-gray-500 font-medium">
              {index + 1}
            </div>

            {/* Department */}
            <div className="col-span-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <MdBusiness className="text-blue-600 text-xl" />
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">{dept.name}</h4>
                <p className="text-xs text-gray-500">Department</p>
              </div>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                Active
              </span>
            </div>

            {/* Actions */}
            <div className="col-span-4 flex justify-end gap-3">
              <button
                onClick={() => handleEdit(dept)}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-blue-100"
              >
                <MdEdit className="text-blue-600 text-lg" />
              </button>

              <button
                onClick={() => handleDelete(dept.id)}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-red-100"
              >
                <MdDelete className="text-red-500 text-lg" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Department"
        title={isEdit ? "Edit Department" : "Add Department"}
        xWidth="450px"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">
              Department Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Legal Affairs"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
            />
          </div>

    

       

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEdit ? "Update Department" : "Create Department"}
            </Button>
          </div>
        </form>
      </DetailModal>
    </div>
  );
};

export default Departments;
