import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "../../../components/layouts/PageHeader";
import Badge from "../../../components/common/Badge";
import Avatar from "../../../components/common/Avatar";
import Button from "../../../components/common/Button";
import {
  MdPerson,
  MdEdit,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdCake,
  MdWork,
  MdBusiness,
  MdBadge,
  MdCalendarToday,
  MdContactPhone,
  MdSave,
  MdClose,
} from "react-icons/md";

const initialProfile = {
  id: "EMP-2024-003",
  name: "Bruce Wayne",
  email: "bruce.w@enterprise-hrms.com",
  phone: "+1 (555) 100-3490",
  department: "Product & Design",
  designation: "Lead Product Designer",
  joiningDate: "2024-06-01",
  status: "Active",
  role: "Employee",
  avatarColor: "#0F172A",
  gender: "Male",
  dateOfBirth: "1988-10-27",
  address: "1007 Mountain Drive, Gotham City, NJ",
  emergencyContact: {
    name: "Alfred Pennyworth",
    relationship: "Guardian",
    phone: "+1 (555) 100-3499",
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

  const Field = ({ label, value, icon, editable = false, field }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        {icon} {label}
      </label>
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
                <MdClose className="text-base" /> Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} id="save-profile-btn">
                <MdSave className="text-base" /> Save Changes
              </Button>
            </div>
          ) : (
            <Button variant="primary" size="sm" onClick={() => setEditMode(true)} id="edit-profile-btn">
              <MdEdit className="text-base" /> Edit Profile
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
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                <MdEdit className="text-xs" />
              </button>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">{profile.name}</h2>
          <p className="text-sm text-slate-500 mb-3">{profile.designation}</p>
          <Badge status={profile.status} className="mb-4">{profile.status}</Badge>

          <div className="w-full space-y-3 text-left border-t border-slate-100 pt-5">
            {[
              { icon: <MdWork className="text-primary text-sm" />, label: "Role", value: profile.role },
              { icon: <MdBusiness className="text-primary text-sm" />, label: "Department", value: profile.department },
              { icon: <MdBadge className="text-primary text-sm" />, label: "Employee ID", value: profile.id },
              { icon: <MdCalendarToday className="text-primary text-sm" />, label: "Joined", value: profile.joiningDate },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">{item.label}</p>
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
            <div className="flex items-center gap-2 mb-5">
              <MdPerson className="text-primary text-lg" />
              <span className="text-base font-bold text-slate-800">Personal Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Full Name"
                value={profile.name}
                icon={<MdPerson className="text-slate-400 text-xs" />}
                editable
                field="name"
              />
              <Field
                label="Email Address"
                value={profile.email}
                icon={<MdEmail className="text-slate-400 text-xs" />}
                editable
                field="email"
              />
              <Field
                label="Phone Number"
                value={profile.phone}
                icon={<MdPhone className="text-slate-400 text-xs" />}
                editable
                field="phone"
              />
              <Field
                label="Date of Birth"
                value={profile.dateOfBirth}
                icon={<MdCake className="text-slate-400 text-xs" />}
              />
              <Field
                label="Gender"
                value={profile.gender}
                icon={<MdPerson className="text-slate-400 text-xs" />}
              />
              <Field
                label="Address"
                value={profile.address}
                icon={<MdLocationOn className="text-slate-400 text-xs" />}
                editable
                field="address"
              />
            </div>
          </motion.div>

          {/* Work Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <MdWork className="text-primary text-lg" />
              <span className="text-base font-bold text-slate-800">Work Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Department" value={profile.department} icon={<MdBusiness className="text-slate-400 text-xs" />} />
              <Field label="Designation" value={profile.designation} icon={<MdBadge className="text-slate-400 text-xs" />} />
              <Field label="Joining Date" value={profile.joiningDate} icon={<MdCalendarToday className="text-slate-400 text-xs" />} />
              <Field label="Employment Status" value={profile.status} icon={<MdWork className="text-slate-400 text-xs" />} />
            </div>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <MdContactPhone className="text-danger text-lg" />
              <span className="text-base font-bold text-slate-800">Emergency Contact</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name</label>
                {editMode ? (
                  <input
                    value={draft.emergencyContact.name}
                    onChange={(e) => setDraft({ ...draft, emergencyContact: { ...draft.emergencyContact, name: e.target.value } })}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-700">{profile.emergencyContact.name}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Relationship</label>
                {editMode ? (
                  <input
                    value={draft.emergencyContact.relationship}
                    onChange={(e) => setDraft({ ...draft, emergencyContact: { ...draft.emergencyContact, relationship: e.target.value } })}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-700">{profile.emergencyContact.relationship}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                {editMode ? (
                  <input
                    value={draft.emergencyContact.phone}
                    onChange={(e) => setDraft({ ...draft, emergencyContact: { ...draft.emergencyContact, phone: e.target.value } })}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50 outline-none focus:border-primary transition-all"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-700">{profile.emergencyContact.phone}</p>
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
