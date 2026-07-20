import { useState, useEffect } from "react";
import { useHRMSData } from "../../../context/HRMSDataContext";
import PageHeader from "../../../components/layouts/PageHeader";
import Tabs from "../../../components/common/Tabs";
import Button from "../../../components/common/Button";
import Badge from "../../../components/common/Badge";
import { MdChevronRight, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import {
  getRoles,
  createRole,
  updateRole,
  getModules,
  getRolePermissions,
  saveRolePermissions,
} from "../../../services/api";
import { toast } from "react-toastify";

const Settings = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [errors, setErrors] = useState({});
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
  });

  // policre
  const {
    companySettings,
    updateSettings,
    fetchLeavePolicies,
    leavePolicies,
    createPolicy,
    updatePolicy,
    deletePolicy,
    payrollPolicies,
  } = useHRMSData();
  const [showLeavePolicyModal, setShowLeavePolicyModal] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState(null);

  const [policyForm, setPolicyForm] = useState({
    leaveType: "",
    annualLimit: "",
    isUnlimited: false,
    carryForward: false,
    accrualCycle: "Yearly",
    status: true,
  });
  const getError = (field) => {
    return errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;
  };
  const handleEditPolicy = (policy) => {
    setPolicyForm({
      leaveType: policy.leaveType,
      annualLimit: policy.annualLimit,
      isUnlimited: policy.isUnlimited,
      carryForward: policy.carryForward,
      accrualCycle: policy.accrualCycle,
      status: policy.status,
    });
    setEditingPolicyId(policy.id);
    setShowLeavePolicyModal(true);
  };

  const handleSavePolicy = async () => {
    try {
      if (editingPolicyId) {
        await updatePolicy(editingPolicyId, policyForm);

        toast.success("Leave Policy Updated Successfully");
      } else {
        await createPolicy(policyForm);

        toast.success("Leave Policy Created Successfully");
      }

      setShowLeavePolicyModal(false);
      setEditingPolicyId(null);

      setPolicyForm({
        leaveType: "",
        annualLimit: "",
        isUnlimited: false,
        carryForward: false,
        accrualCycle: "Yearly",
        status: true,
      });
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      console.log(apiErrors);

      if (apiErrors) {
        const formattedErrors = {};

        apiErrors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });

        setErrors(formattedErrors);

        return;
      }

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeletePolicy = async (id) => {
    const result = await Swal.fire({
      title: "Delete Leave Policy?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete",
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deletePolicy(id);
      toast.success("Leave Policy Deleted Successfully");
      fetchLeavePolicies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete Failed");
    }
  };

  const handleEditRole = (role) => {
    setRoleForm({
      name: role.name,
      description: role.description,
    });

    setEditingRoleId(role.id);
    setShowRoleModal(true);
  };

  const handleSaveRole = async () => {
    try {
      if (editingRoleId) {
        await updateRole(editingRoleId, roleForm);
        toast.success("Role Updated Successfully");
      } else {
        await createRole(roleForm);
        toast.success("Role Created Successfully");
      }

      loadRoles();
      setShowRoleModal(false);
      setRoleForm({
        name: "",
        description: "",
      });
      setEditingRoleId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const [activeTab, setActiveTab] = useState("company");

  // Local Form state for Company
  const [compForm, setCompForm] = useState({ ...companySettings });

  const tabs = [
    { id: "company", label: "Company Settings" },
    { id: "roles", label: "Roles & Permissions" },
    { id: "leave", label: "Leave Policies" },
    { id: "payroll", label: "Payroll Rules" },
    { id: "notifications", label: "Notification Settings" },
  ];

  const loadModules = async () => {
    const res = await getModules();

    setModules(res.data.data);
  };

  useEffect(() => {
    loadRoles();
    loadModules();
  }, []);

  const loadRoles = async () => {
    try {
      const res = await getRoles();

      setRoles(res.data.data);

      if (res.data.data.length > 0) {
        await handleRoleSelect(res.data.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPermissions = async () => {
    const res = await getPermissions();
    console.log("Permissions =>", res);
    setPermissions(res.data.data);
  };

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);

    const res = await getRolePermissions(role.id);

    setRolePermissions(res.data.data);
  };

  const handleOperationChange = (moduleId, operation, checked) => {
    setRolePermissions((prev) => {
      const index = prev.findIndex((p) => p.module.id === moduleId);

      if (index >= 0) {
        const copy = [...prev];

        copy[index].operations[operation] = checked;

        return copy;
      }

      return [
        ...prev,
        {
          module: {
            id: moduleId,
          },
          operations: {
            create: false,
            view: false,
            update: false,
            delete: false,
            approve: false,
            export: false,
            [operation]: checked,
          },
        },
      ];
    });
  };
  const handleSavePermissions = async () => {
    if (!selectedRole) {
      toast.error("Select Role First");
      return;
    }

    await saveRolePermissions({
      roleId: selectedRole.id,
      permissions: rolePermissions.map((item) => ({
        moduleId: item.module.id,
        operations: item.operations,
      })),
    });

    toast.success("Permissions Saved Successfully");
  };

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    updateSettings(compForm);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure platform rules, policies, and account setups"
      />

      <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm min-h-[480px]">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Company Settings */}
        {activeTab === "company" && (
          <form onSubmit={handleCompanySubmit}>
            <h3 className="text-base font-bold text-text-primary mb-5 pb-2 border-b border-border-color">
              Company Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Company Name
                </label>
                <input
                  type="text"
                  value={compForm.companyName}
                  onChange={(e) =>
                    setCompForm({ ...compForm, companyName: e.target.value })
                  }
                  className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Official Email
                </label>
                <input
                  type="email"
                  value={compForm.companyEmail}
                  onChange={(e) =>
                    setCompForm({ ...compForm, companyEmail: e.target.value })
                  }
                  className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={compForm.companyPhone}
                  onChange={(e) =>
                    setCompForm({ ...compForm, companyPhone: e.target.value })
                  }
                  className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Base Currency
                </label>
                <select
                  value={compForm.currency}
                  onChange={(e) =>
                    setCompForm({ ...compForm, currency: e.target.value })
                  }
                  className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary transition-all"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Standard Timezone
                </label>
                <select
                  value={compForm.timezone}
                  onChange={(e) =>
                    setCompForm({ ...compForm, timezone: e.target.value })
                  }
                  className="px-3.5 py-2.5 rounded-md border border-border-color bg-bg-primary text-text-primary text-sm outline-none focus:border-primary transition-all"
                >
                  <option value="UTC-5 (EST)">UTC-5 (EST)</option>
                  <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                  <option value="UTC+5:30 (IST)">UTC+5:30 (IST)</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Office Address
                </label>
                <textarea
                  rows="3"
                  value={compForm.address}
                  onChange={(e) =>
                    setCompForm({ ...compForm, address: e.target.value })
                  }
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

        {activeTab === "roles" && (
          <div>
            <div className="flex items-center justify-between mb-5 pb-2 border-b border-border-color">
              <h3 className="text-base font-bold text-text-primary">
                Roles & Permissions
              </h3>

              <Button
                variant="primary"
                onClick={() => {
                  setEditingRoleId(null);

                  setRoleForm({
                    name: "",
                    description: "",
                  });
                  console.log("Button Clicked");
                  setShowRoleModal(true);
                }}
              >
                + Add Role
              </Button>
            </div>

            <div className="bg-bg-primary border border-border-color rounded-xl p-4 mb-6">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Select Role
              </label>

              <select
                className="w-full border border-border-color rounded-lg p-2"
                value={selectedRole?.id || ""}
                onChange={(e) => {
                  const role = roles.find((item) => item.id === e.target.value);

                  setSelectedRole(role);

                  if (role) {
                    handleRoleSelect(role);
                  }
                }}
              >
                <option value="">Select Role</option>

                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedRole ? (
              <div className="bg-bg-primary border border-border-color rounded-xl p-4">
                <h4 className="font-semibold text-text-primary mb-4">
                  Module Permissions - {selectedRole.name}
                </h4>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-border-color">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2 text-left">Module</th>

                        <th className="border p-2">Create</th>

                        <th className="border p-2">View</th>

                        <th className="border p-2">Update</th>

                        <th className="border p-2">Delete</th>

                        <th className="border p-2">Approve</th>

                        <th className="border p-2">Export</th>
                      </tr>
                    </thead>

                    <tbody>
                      {/* {modules.map((module) => {
                        const permission = rolePermissions.find(
                          (p) => p.module.id === module.id,
                        );

                        return (
                          <tr key={module.id}>
                            <td className="border p-2 font-medium">
                              {module.name}
                            </td>

                            {[
                              "create",
                              "view",
                              "update",
                              "delete",
                              "approve",
                              "export",
                            ].map((operation) => (
                              <td
                                key={operation}
                                className="border p-2 text-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    permission?.operations?.[operation] || false
                                  }
                                  disabled={
                                    selectedRole?.name === "SUPER_ADMIN" ||
                                    selectedRole?.name === "TENANT_ADMIN"
                                  }
                                  onChange={(e) =>
                                    handleOperationChange(
                                      module.id,
                                      operation,
                                      e.target.checked,
                                    )
                                  }
                                />
                              </td>
                            ))}
                          </tr>
                        );
                      })} */}

                      {modules
                        .filter((module) => !module.parentId)
                        .map((module) => (
                          <>
                            <tr key={module.id}>
                              <td className="border p-2 font-bold">
                                {module.name}
                              </td>

                              {[
                                "create",
                                "view",
                                "update",
                                "delete",
                                "approve",
                                "export",
                              ].map((operation) => (
                                <td className="border p-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={
                                      rolePermissions.find(
                                        (p) => p.module.id === module.id,
                                      )?.operations?.[operation] || false
                                    }
                                    onChange={(e) =>
                                      handleOperationChange(
                                        module.id,
                                        operation,
                                        e.target.checked,
                                      )
                                    }
                                  />
                                </td>
                              ))}
                            </tr>

                            {module.children?.map((child) => (
                              <tr key={child.id}>
                                <td className="border p-2 pl-10">
                                  {child.name}
                                </td>

                                {[
                                  "create",
                                  "view",
                                  "update",
                                  "delete",
                                  "approve",
                                  "export",
                                ].map((operation) => (
                                  <td className="border p-2 text-center">
                                    <input
                                      type="checkbox"
                                      checked={
                                        rolePermissions.find(
                                          (p) => p.module.id === child.id,
                                        )?.operations?.[operation] || false
                                      }
                                      onChange={(e) =>
                                        handleOperationChange(
                                          child.id,
                                          operation,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mt-6">
                  <Button variant="primary" onClick={handleSavePermissions}>
                    Save Permissions
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-bg-primary border border-border-color rounded-xl p-10 text-center">
                <p className="text-gray-500">
                  Please select a role to view permissions
                </p>
              </div>
            )}
          </div>
        )}

        {showRoleModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-5">Add New Role</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Role Name{" "}
                  </label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(e) =>
                      setRoleForm({
                        ...roleForm,
                        name: e.target.value,
                      })
                    }
                    className="w-full border border-border-color rounded-lg px-3 py-2 text-sm"
                    placeholder="TEAM_LEAD"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {" "}
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={roleForm.description}
                    onChange={(e) =>
                      setRoleForm({
                        ...roleForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-border-color rounded-lg px-3 py-2 text-sm"
                    placeholder="Role Description"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowRoleModal(false)}
                >
                  Cancel{" "}
                </Button>

                <Button variant="primary" onClick={handleSaveRole}>
                  {editingRoleId ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "leave" && (
          <div>
            <div className="flex items-center justify-between mb-5 pb-2 border-b border-border-color">
              <h3 className="text-base font-bold text-text-primary">
                Company Leave Configurations
              </h3>

              <button
                onClick={() => {
                  setEditingPolicyId(null);
                  setPolicyForm({
                    leaveType: "",
                    annualLimit: "",
                    isUnlimited: false,
                    carryForward: false,
                    accrualCycle: "Yearly",
                    status: true,
                  });
                  console.log("button have click");
                  setShowLeavePolicyModal(true);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
              >
                + Add Policy
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {leavePolicies.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-border-color rounded-xl shadow-sm p-5 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-text-primary text-lg">
                      {p.leaveType}
                    </h4>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Annual Limit</span>

                      <span className="font-medium">
                        {p.isUnlimited ? "Unlimited" : `${p.annualLimit} Days`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Accrual Cycle</span>

                      <span className="font-medium">{p.accrualCycle}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Carry Forward</span>

                      <span className="font-medium">
                        {p.carryForward ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => handleEditPolicy(p)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeletePolicy(p.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))} 
            </div>
          </div>
        )}

        {showLeavePolicyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold">
                  {editingPolicyId ? "Edit Leave Policy" : "Add Leave Policy"}
                </h2>

                <button
                  onClick={() => setShowLeavePolicyModal(false)}
                  className="text-gray-500 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Leave Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Leave Type
                  </label>

                  <input
                    type="text"
                    value={policyForm.leaveType}
                    onChange={(e) => {
                      setPolicyForm({
                        ...policyForm,
                        leaveType: e.target.value,
                      });

                      setErrors({
                        ...errors,
                        leaveType: "",
                      });
                    }}
                    className={`w-full rounded-lg px-3 py-2 border ${
                      errors.leaveType ? "border-red-500" : "border-gray-300"
                    }`}
                  />

                  {getError("leaveType")}
                </div>

                {/* Annual Limit */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Annual Limit
                  </label>

                  <input
                    type="number"
                    value={policyForm.annualLimit}
                    onChange={(e) => {
                      setPolicyForm({
                        ...policyForm,
                        annualLimit: e.target.value,
                      });

                      setErrors({
                        ...errors,
                        annualLimit: "",
                      });
                    }}
                    className={`w-full rounded-lg px-3 py-2 border ${
                      errors.annualLimit ? "border-red-500" : "border-gray-300"
                    }`}
                  />

                  {getError("annualLimit")}
                </div>

                {/* Accrual Cycle */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Accrual Cycle
                  </label>

                  <select
                    value={policyForm.accrualCycle}
                    onChange={(e) => {
                      setPolicyForm({
                        ...policyForm,
                        accrualCycle: e.target.value,
                      });

                      setErrors({
                        ...errors,
                        accrualCycle: "",
                      });
                    }}
                    className={`w-full rounded-lg px-3 py-2 border ${
                      errors.accrualCycle ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>

                  {getError("accrualCycle")}
                </div>

                {/* Unlimited */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={policyForm.isUnlimited}
                    onChange={(e) => {
                      setPolicyForm({
                        ...policyForm,
                        isUnlimited: e.target.checked,
                      });

                      setErrors({
                        ...errors,
                        isUnlimited: "",
                      });
                    }}
                  />

                  <label>Unlimited Leave</label>
                </div>

                {getError("isUnlimited")}

                {/* Carry Forward */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={policyForm.carryForward}
                    onChange={(e) => {
                      setPolicyForm({
                        ...policyForm,
                        carryForward: e.target.checked,
                      });

                      setErrors({
                        ...errors,
                        carryForward: "",
                      });
                    }}
                  />

                  <label>Carry Forward</label>
                </div>

                {getError("carryForward")}

                {/* Status */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={policyForm.status}
                    onChange={(e) => {
                      setPolicyForm({
                        ...policyForm,
                        status: e.target.checked,
                      });

                      setErrors({
                        ...errors,
                        status: "",
                      });
                    }}
                  />

                  <label>Active</label>
                </div>

                {getError("status")}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowLeavePolicyModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSavePolicy}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {editingPolicyId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payroll Rules */}
        {activeTab === "payroll" && (
          <div>
            <h3 className="text-base font-bold text-text-primary mb-5 pb-2 border-b border-border-color">
              Financial Rules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
              <div className="bg-bg-primary border border-border-color rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                <div className="font-bold text-sm text-gray-700">
                  PF contribution Rate
                </div>
                <div className="text-2xl font-extrabold text-blue-500 mt-2">
                  {payrollPolicies.pfContribution}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Deducted from gross base salary monthly
                </div>
              </div>

              <div className="bg-bg-primary border border-border-color rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                <div className="font-bold text-sm text-gray-700">
                  Standard Working Hours
                </div>
                <div className="text-2xl font-extrabold text-blue-500 mt-2">
                  {payrollPolicies.standardWorkingHours} Hours / mo
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Required check-ins to avoid salary deduction
                </div>
              </div>

              <div className="bg-bg-primary border border-border-color rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                <div className="font-bold text-sm text-gray-700">
                  Overtime Multiplier
                </div>
                <div className="text-2xl font-extrabold text-blue-500 mt-2">
                  {payrollPolicies.overtimeRate}x
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Hourly rate calculation for extra logs
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <div>
            <h3 className="text-base font-bold text-text-primary mb-5 pb-2 border-b border-border-color">
              Email & Alert Triggers
            </h3>
            <div className="flex flex-col gap-4 mt-4">
              {[
                "Send email alert on new leave application request",
                "Notify HR on new recruitment candidate submission",
                "Generate notifications for completed monthly payroll",
                "Send weekly attendance digests to department managers",
                "Notify employee on profile data updates",
              ].map((opt, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-gray-700"
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
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
