const StaffProfileCard = ({ profile, today, shift }) => {
  return (
    <div
      className="
bg-white
rounded-3xl
p-6
shadow-sm
border
sticky
top-5
"
    >
      <div className="text-center">
        <img
          src={profile?.image || "/avatar.png"}
          className="
w-24
h-24
rounded-full
mx-auto
object-cover
"
        />

        <h2 className="mt-3 font-bold text-lg">
          {profile?.fullName || "Employee"}
        </h2>

        <p className="text-sm text-slate-400">{profile?.designation}</p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Department</span>

          <b>{profile?.department?.name}</b>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Shift</span>

          <b>{shift?.shiftName}</b>
        </div>

        <div className="flex justify-between">
          <span>Timing</span>

          <b>
            {shift?.startTime} - {shift?.endTime}
          </b>
        </div>
      </div>
    </div>
  );
};

export default StaffProfileCard;
