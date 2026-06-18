import { useState } from "react";

import PageHeader from "../../../components/layouts/PageHeader";
import Button from "../../../components/common/Button";
import Badge from "../../../components/common/Badge";
import DetailModal from "../../../components/modals/DetailModal";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {getDesignations,createDesignation,updateDesignation,deleteDesignation,getDepartments} from "../../../services/api";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";

const Designations = () => {
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    department_id: "",
    baseSalary: ""
  });

  useEffect(() => {
    loadDepartments();
    loadDesignations();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await getDepartments();
      console.log("Departments =>", res.data.data);
      setDepartments(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadDesignations = async () => {
    try {
      console.log(designations);
      const res = await getDesignations();
      console.log(res.data.data);

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
      baseSalary: desg.baseSalary
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

        await updateDesignation(
          selectedId,
          {
            title:formData.title,
            department_id: formData.department_id,
            baseSalary:
              Number(formData.baseSalary)
          }
        );
        toast.success("Designation Updated");

      } else {
        await createDesignation(formData);
        toast.success(
          "Designation Created"
        );
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
                <span className="text-base font-bold text-text-primary leading-tight">{desg.title}</span>
                <span className="text-xs text-text-secondary font-medium">{departments.find(d => d.id === desg.department_id)?.name || "-"}</span>
              </div>
              {/* <Badge status="WFH">{desg.grade}</Badge> */}
              <div className="p-2 bg-primary/10 rounded-lg">
                <div className="flex text-primary gap-2">
                  <button onClick={() => handleEdit(desg)}>
                    <MdEdit />
                  </button>

                  <button onClick={() => handleDelete(desg.id)}>
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-2 border-t border-border-color pt-3 text-sm">
              <span className="text-text-secondary">Base Salary</span>
              <span className="font-bold text-text-primary">${Number(desg.baseSalary || 0).toLocaleString()} / yr</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          isEdit
            ? "Edit Designation"
            : "Add Designation"
        }
        maxWidth="450px"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Designation Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Lead QA Engineer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Department</label>
            <select
              required
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
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
            {/* <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Grade / Level</label>
              <input
                type="text"
                placeholder="e.g. L3"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
              />
            </div> */}
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
              {
                isEdit
                  ? "Update Designation"
                  : "Create Designation"
              }
            </Button>
          </div>
        </form>
      </DetailModal>
    </div>
  );
};

export default Designations;
