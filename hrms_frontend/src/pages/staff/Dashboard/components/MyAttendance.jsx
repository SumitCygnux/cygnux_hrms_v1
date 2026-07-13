const MyAttendance = ({ attendance = [] }) => {
  const data = {
    Present: attendance.filter((a) => a.status === "Present").length,

    Absent: attendance.filter((a) => a.status === "Absent").length,

    Late: attendance.filter((a) => a.late).length,

    Early: attendance.filter((a) => a.earlyOut).length,

    Penalty: attendance.filter((a) => a.penalty).length,
  };

  return (
    <div
      className="
bg-white
rounded-3xl
p-5
border
shadow-sm
"
    >
      <div className="flex justify-between">
        <h3 className="font-bold">My Attendance</h3>

        <button className="text-xs text-blue-500">View</button>
      </div>

      <div
        className="
grid
grid-cols-2
md:grid-cols-5
gap-4
mt-5
"
      >
        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            className="
bg-slate-50
rounded-xl
p-4
text-center
"
          >
            <h2
              className="
font-bold
text-xl
"
            >
              {value}
            </h2>

            <p
              className="
text-xs
text-slate-400
"
            >
              {key}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAttendance;
