import dayjs from "dayjs";

const AttendanceCalendar = ({ attendance = [] }) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const currentMonth = dayjs().daysInMonth();

  return (
    <div
      className="
bg-white
rounded-3xl
p-5
border
border-slate-100
shadow-sm
"
    >
      <div className="flex justify-between mb-5">
        <h3 className="font-bold text-slate-800">Attendance Calendar</h3>

        <span className="text-xs text-slate-400">
          {dayjs().format("MMMM YYYY")}
        </span>
      </div>

      <div
        className="
grid
grid-cols-7
gap-2
text-center
"
      >
        {days.map((day) => (
          <div
            key={day}
            className="
text-xs
font-bold
text-slate-400
"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: currentMonth }, (_, i) => {
          const date = i + 1;

          const record = attendance.find((a) => dayjs(a.date).date() === date);

          return (
            <div
              key={i}
              className={`
h-10
rounded-xl
flex
items-center
justify-center
text-xs
font-bold
${
  record?.status === "Present"
    ? "bg-emerald-100 text-emerald-600"
    : record?.status === "Absent"
      ? "bg-rose-100 text-rose-600"
      : "bg-slate-50 text-slate-600"
}

`}
            >
              {date}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
