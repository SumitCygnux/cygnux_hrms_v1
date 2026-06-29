import { useState } from "react";

import PageHeader from "../../../components/layouts/PageHeader";
import Button from "../../../components/common/Button";
import Badge from "../../../components/common/Badge";
import DetailModal from "../../../components/modals/DetailModal";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  getDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  getDepartments,
} from "../../../services/api";
import { MdEdit, MdDelete, MdAdd, MdWork } from "react-icons/md";

const Designations = () => {
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    department_id: "",
    baseSalary: "",
  });

  useEffect(() => {
    loadDepartments();
    loadDesignations();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await getDepartments();
      console.log("Departments => ", res.data.data);
      setDepartments(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadDesignations = async () => {
    try {
     
      const res = await getDesignations();
      console.log( "designations =>",res.data.data);

      setDesignations(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (desg) => {
    setIsEdit(true);
    setSelectedId(desg.id);
    setFormData({
      title: desg.title,
      department_id: desg.department_id,
      baseSalary: desg.baseSalary,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDesignation(id);
      toast.success("Designation Deleted");
      loadDesignations();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateDesignation(selectedId, {
          title: formData.title,
          department_id: formData.department_id,
          baseSalary: Number(formData.baseSalary),
        });
        toast.success("Designation Updated");
      } else {
        await createDesignation(formData);
        toast.success("Designation Created");
      }

      loadDesignations();
      setFormData({
        title: "",
        department_id: "",
        baseSalary: "",
      });
      setSelectedId(null);
      setIsEdit(false);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      console.log(error?.response);
      console.log(error?.response?.data);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <PageHeader
        title="Designations"
        subtitle="Manage company role templates, grades and base compensations"
        actions={
          <Button
            variant="primary"
            iconBefore={<MdAdd />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Designation
          </Button>
        }
      />
      {/* card */}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="grid grid-cols-12 bg-gray-50 px-6 py-3 border-b text-sm font-semibold text-gray-600">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Designation</div>
          <div className="col-span-4">Department</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {designations.map((desg, index) => (
          <div
            key={desg.id}
            className="grid grid-cols-12 items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <div className="col-span-1 text-gray-500">{index + 1}</div>

            <div className="col-span-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <MdWork className="text-blue-600 text-lg" />
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">{desg.title}</h4>
                <p className="text-xs text-gray-500">Employee Designation</p>
              </div>
            </div>

            <div className="col-span-4">
              <span className="text-gray-700">
                {/* {departments.find((d) => d.id === desg.department_id)?.name ||  "-"} */}
                    {desg.department?.name || "-"}
              </span>
            </div>

            <div className="col-span-1">
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                Active
              </span>
            </div>

            <div className="col-span-2 flex justify-end gap-2">
              <button
                onClick={() => handleEdit(desg)}
                className="w-9 h-9 rounded-lg border hover:bg-blue-50 flex justify-center items-center"
              >
                <MdEdit className="text-blue-600" />
              </button>

              <button
                onClick={() => handleDelete(desg.id)}
                className="w-9 h-9 rounded-lg border hover:bg-red-50 flex justify-center items-center"
              >
                <MdDelete className="text-red-500"/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEdit ? "Edit Designation" : "Add Designation"}
        maxWidth="450px"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">
              Designation Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lead QA Engineer"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">
              Department
            </label>
            <select
              required
              value={formData.department_id}
              onChange={(e) =>
                setFormData({ ...formData, department_id: e.target.value })
              }
              className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
           
      
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEdit ? "Update Designation" : "Create Designation"}
            </Button>
          </div>
        </form>
      </DetailModal>
    </div>
  );
};

export default Designations;
