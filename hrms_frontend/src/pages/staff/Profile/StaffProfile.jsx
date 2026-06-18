import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "../../../components/layouts/PageHeader";
import Badge from "../../../components/common/Badge";
import Avatar from "../../../components/common/Avatar";
import Button from "../../../components/common/Button";

const initialProfile = {
  id: "EMP-2024-003",
  name: "Bruce Wayne",
  email: "bruce.w@enterprise-hrms.com",
  phone: "+91 98765 43210",
  department: "Product & Design",
  designation: "Lead Product Designer",
  joiningDate: "2024-06-01",
  status: "Active",
  role: "Employee",
  avatarColor: "#0F172A",
  gender: "Male",
  dateOfBirth: "1988-10-27",
  address: "1007 Mountain Drive, Mumbai, Maharashtra",
  emergencyContact: {
    name: "Alfred Pennyworth",
    relationship: "Guardian",
    phone: "+91 99887 76655",
  },
};

const StaffProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);

  const handleSave = () => {
    setProfile(draft);
    setEditMode(false);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditMode(false);
  };

  const Field = ({ label, value, editable = false, field }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
      {editMode && editable ? (
        <input
          value={draft[field] || ""}
          onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all"
        />
      ) : (
        <p className="text-sm font-medium text-slate-700">{value}</p>
      )}
    </div>
  );

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="View and update your personal information"
        actions={
          editMode ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel} id="cancel-profile-edit">
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} id="save-profile-btn">
                Save Changes
              </Button>
            </div>
          ) : (
            <Button variant="primary" size="sm" onClick={() => setEditMode(true)} id="edit-profile-btn">
              Edit Profile
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-7 flex flex-col items-center text-center xl:col-span-1"
        >
          <div className="relative mb-4">
            <Avatar name={profile.name} color={profile.avatarColor} size={96} />
            {editMode && (
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white shadow-lg text-xs font-bold">
                Ed
              </button>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">{profile.name}</h2>
          <p className="text-sm text-slate-500 mb-3">{profile.designation}</p>
          <Badge status={profile.status} className="mb-4">
            {profile.status}
          </Badge>

          <div className="w-full space-y-3 text-left border-t border-slate-100 pt-5">
            {[
              { label: "Role", value: profile.role },
              { label: "Department", value: profile.department },
              { label: "Employee ID", value: profile.id },
              { label: "Joined", value: profile.joiningDate },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary/30 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-xs font-semibold text-slate-700">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Details Panel */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6"
          >
            <div className="mb-5 pb-3 border-b border-slate-100">
              <p className="text-base font-bold text-slate-800">Personal Information</p>
              <p className="text-xs text-slate-400 mt-0.5">Contact and identity details</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Full Name" value={profile.name} editable field="name" />
              <Field label="Email Address" value={profile.email} editable field="email" />
              <Field label="Phone Number" value={profile.phone} editable field="phone" />
              <Field label="Date of Birth" value={profile.dateOfBirth} />
              <Field label="Gender" value={profile.gender} />
              <Field label="Address" value={profile.address} editable field="address" />
            </div>
          </motion.div>

          {/* Work Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6"
          >
            <div className="mb-5 pb-3 border-b border-slate-100">
              <p className="text-base font-bold text-slate-800">Work Information</p>
              <p className="text-xs text-slate-400 mt-0.5">Employment and department details</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Department" value={profile.department} />
              <Field label="Designation" value={profile.designation} />
              <Field label="Joining Date" value={profile.joiningDate} />
              <Field label="Employment Status" value={profile.status} />
            </div>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6"
          >
            <div className="mb-5 pb-3 border-b border-slate-100">
              <p className="text-base font-bold text-slate-800">Emergency Contact</p>
              <p className="text-xs text-slate-400 mt-0.5">Person to contact in case of emergency</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Name
                </label>
                {editMode ? (
                  <input
                    value={draft.emergencyContact.name}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        emergencyContact: { ...draft.emergencyContact, name: e.target.value },
                      })
                    }
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-700">{profile.emergencyContact.name}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Relationship
                </label>
                {editMode ? (
                  <input
                    value={draft.emergencyContact.relationship}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        emergencyContact: {
                          ...draft.emergencyContact,
                          relationship: e.target.value,
                        },
                      })
                    }
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-700">
                    {profile.emergencyContact.relationship}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Phone
                </label>
                {editMode ? (
                  <input
                    value={draft.emergencyContact.phone}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        emergencyContact: { ...draft.emergencyContact, phone: e.target.value },
                      })
                    }
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-700">
                    {profile.emergencyContact.phone}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
