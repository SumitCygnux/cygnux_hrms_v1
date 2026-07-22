import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/layouts/PageHeader";
import Button from "../../../components/common/Button";
import { MdPersonAdd, MdEdit, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getTeams, deleteTeam } from "../../../services/api";
import { toast } from "react-toastify";
import { usePermission } from "../../../hooks/usePermission";
function Team() {
    const { canView, canCreate, canUpdate, canDelete } = usePermission("team");
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const res = await getTeams();
      
      setTeams(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) {
      return;
    }

    try {
      await deleteTeam(id);
      toast.success("Team deleted successfully");
      loadTeams();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

 if (!canView) {
  return (
    <div className="flex justify-center items-center h-96">
      <h2 className="text-lg font-semibold text-gray-500">
        You don't have permission to view this page.
      </h2>
    </div>
  );
} return (
    <div>
      <PageHeader
        title="Team Management"
        subtitle="View teams in department"
        actions={
            canCreate && (
          <Button
            variant="primary"
            iconBefore={<MdPersonAdd />}
            onClick={() => navigate("/addteam")}
          >
            Add Team
          </Button>
          )
        }
      />

      <div className="mt-6 overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">No</th>
              <th className="p-3">Team Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {teams.length > 0 ? (
              teams.map((team, index) => (
                <tr key={team.id} className="border-t">
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3">{team.teamName}</td>

                  <td className="p-3">{team.department?.name}</td>

                  <td className="p-3">{team.status}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                  
                  {canUpdate && (
                      <button
                        onClick={() => navigate(`/addteam/${team.id}`)}
                        className="inline-flex items-center gap-2 rounded-full border border-blue-400 bg-blue-200 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-200"
                      >
                        <MdEdit size={18} />
                        Edit
                      </button>
                  )}
                
                {canDelete && (
                      <button
                        onClick={() => handleDelete(team.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-red-500 bg-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-700 hover:border-red-600 hover:text-white transition-all duration-200"
                      >
                        <MdDelete size={18} />
                        Delete
                      </button>
                )}
                
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-5">
                  No Team Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Team;
