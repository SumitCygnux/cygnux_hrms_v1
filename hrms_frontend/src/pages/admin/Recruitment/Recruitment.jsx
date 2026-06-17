import { useState, useMemo } from "react";
import { useHRMSData } from "../../../context/HRMSDataContext";
import PageHeader from "../../../components/layouts/PageHeader";
import Button from "../../../components/common/Button";
import DetailModal from "../../../components/modals/DetailModal";
import {
  MdAdd,
  MdArrowBack,
  MdArrowForward,
  MdStar
} from "react-icons/md";


const Recruitment = () => {
  const {
    candidates,
    recruitmentJobs,
    addCandidate,
    updateCandidateStage
  } = useHRMSData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "Senior React Developer"
  });

  const columns = ["Applied", "Screening", "Interview", "Technical Round", "Offer", "Hired"];

  // Stats
  const stats = useMemo(() => {
    const openPos = recruitmentJobs.filter((j) => j.status === "Active").length;
    const totalApps = candidates.length;
    const interviews = candidates.filter((c) => c.stage === "Interview" || c.stage === "Technical Round").length;
    const offers = candidates.filter((c) => c.stage === "Offer").length;
    const hired = candidates.filter((c) => c.stage === "Hired").length;
    return { openPos, totalApps, interviews, offers, hired };
  }, [candidates, recruitmentJobs]);

  const handleMove = (candId, currentStage, direction) => {
    const currentIndex = columns.indexOf(currentStage);
    let nextIndex = currentIndex;
    if (direction === "next" && currentIndex < columns.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (direction === "prev" && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }

    if (nextIndex !== currentIndex) {
      updateCandidateStage(candId, columns[nextIndex]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addCandidate(formData);
    setIsModalOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      jobTitle: "Senior React Developer"
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <PageHeader
        title="Recruitment Pipeline"
        subtitle="Manage open positions and track applicant pipeline"
        actions={
          <Button variant="primary" iconBefore={<MdAdd />} onClick={() => setIsModalOpen(true)}>
            Add Candidate
          </Button>
        }
      />

      {/* Recruitment KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <div className="bg-bg-secondary border border-border-color rounded-lg p-4 text-center shadow-sm flex flex-col gap-1 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary">
          <span className="text-[11px] text-text-secondary font-bold uppercase">Open Positions</span>
          <span className="text-2xl font-extrabold text-text-primary">{stats.openPos}</span>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-lg p-4 text-center shadow-sm flex flex-col gap-1 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary">
          <span className="text-[11px] text-text-secondary font-bold uppercase">Total Applications</span>
          <span className="text-2xl font-extrabold text-text-primary">{stats.totalApps}</span>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-lg p-4 text-center shadow-sm flex flex-col gap-1 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary">
          <span className="text-[11px] text-text-secondary font-bold uppercase">Active Interviews</span>
          <span className="text-2xl font-extrabold text-warning">{stats.interviews}</span>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-lg p-4 text-center shadow-sm flex flex-col gap-1 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary">
          <span className="text-[11px] text-text-secondary font-bold uppercase">Offers Extended</span>
          <span className="text-2xl font-extrabold text-info">{stats.offers}</span>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-lg p-4 text-center shadow-sm flex flex-col gap-1 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary">
          <span className="text-[11px] text-text-secondary font-bold uppercase">Hired This Quarter</span>
          <span className="text-2xl font-extrabold text-success">{stats.hired}</span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto items-start pb-3">
        {columns.map((colName) => {
          const colCandidates = candidates.filter((c) => c.stage === colName);
          return (
            <div key={colName} className="bg-bg-primary border border-border-color rounded-2xl p-4 flex flex-col gap-3 min-h-[480px] min-w-[200px]">
              <div className="flex justify-between items-center font-bold text-sm text-text-primary border-b border-border-color pb-2">
                <span>{colName}</span>
                <span className="bg-border-color px-2 py-0.5 rounded-full text-[11px]">{colCandidates.length}</span>
              </div>

              {colCandidates.map((cand) => (
                <div key={cand.id} className="bg-bg-secondary border border-border-color rounded-lg p-3 shadow-sm flex flex-col gap-2 transition-all duration-150 hover:border-primary hover:-translate-y-0.5">
                  <div className="font-semibold text-sm text-text-primary">{cand.name}</div>
                  <div className="text-[11px] text-text-secondary">{cand.jobTitle}</div>
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-warning">
                    <MdStar />
                    <span>{cand.rating.toFixed(1)}</span>
                  </div>

                  <div className="flex justify-between mt-1 border-t border-dashed border-border-color pt-2">
                    <button
                      className="bg-transparent border-none text-base text-text-secondary cursor-pointer transition-colors duration-150 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={colName === "Applied"}
                      onClick={() => handleMove(cand.id, colName, "prev")}
                      aria-label="Move back"
                    >
                      <MdArrowBack />
                    </button>
                    <button
                      className="bg-transparent border-none text-base text-text-secondary cursor-pointer transition-colors duration-150 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={colName === "Hired"}
                      onClick={() => handleMove(cand.id, colName, "next")}
                      aria-label="Move forward"
                    >
                      <MdArrowForward />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Add Candidate Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Applicant"
        maxWidth="450px"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Applicant Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Wanda Maximoff"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="e.g. wanda.m@westview.org"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="e.g. +1 (555) 012-4444"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Target Role</label>
            <select
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800 outline-none"
            >
              {recruitmentJobs.map((job) => (
                <option key={job.id} value={job.title}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Applicant
            </Button>
          </div>
        </form>
      </DetailModal>
    </div>
  );
};

export default Recruitment;
