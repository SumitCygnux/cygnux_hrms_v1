const LateArrival = ({ attendance = [] }) => {
  const late = attendance.filter((a) => a.late);

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
        <h3 className="font-bold">Late Arrivals</h3>

        <button className="text-xs text-blue-500">View</button>
      </div>

      <p className="text-xs text-slate-400 mt-5">({late.length})</p>

      {late.length ? (
        late.map((item) => (
          <div
            key={item.id}
            className="
mt-3
bg-slate-50
rounded-xl
p-3
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
          No late arrival in this month.
        </p>
      )}
    </div>
  );
};

export default LateArrival;
