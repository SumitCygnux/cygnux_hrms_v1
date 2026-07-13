const EarlyOutReminder = ({ attendance = [] }) => {
  const earlyOut = attendance.filter((a) => a.earlyOut);

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
        <h3 className="font-bold">Early Out Reminder</h3>

        <button
          className="
text-xs
text-blue-500
"
        >
          View
        </button>
      </div>

      <p className="text-xs text-slate-400 mt-5">({earlyOut.length})</p>

      {earlyOut.length ? (
        earlyOut.map((item) => (
          <div
            key={item.id}
            className="
mt-3
bg-slate-50
p-3
rounded-xl
text-sm
"
          >
            {item.date}
          </div>
        ))
      ) : (
        <p
          className="
text-sm
text-gray-400
mt-5
"
        >
          No Early out in this month
        </p>
      )}
    </div>
  );
};

export default EarlyOutReminder;
