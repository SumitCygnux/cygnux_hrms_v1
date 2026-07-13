const UpcomingHoliday = ({ holidays = [] }) => {
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
        <h3 className="font-bold">Upcoming Holiday</h3>

        <button className="text-xs text-blue-500">View</button>
      </div>

      {holidays.length ? (
        <div className="mt-5 space-y-3">
          {holidays.map((holiday) => (
            <div
              key={holiday.id}
              className="
bg-slate-50
rounded-xl
p-4
flex
justify-between
"
            >
              <span className="text-sm font-semibold">{holiday.name}</span>

              <span className="text-xs text-slate-400">{holiday.date}</span>
            </div>
          ))}
        </div>
      ) : (
        <p
          className="
text-sm
text-slate-400
mt-5
"
        >
          No upcoming holiday for the month
        </p>
      )}
    </div>
  );
};

export default UpcomingHoliday;
