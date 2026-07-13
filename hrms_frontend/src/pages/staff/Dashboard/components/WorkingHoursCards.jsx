const WorkingHoursCards = ({ attendance }) => {
  const data = [
    {
      title: "Expected Working Hours",
      value: attendance?.expected || "200 H : 00 M",
    },

    {
      title: "Actual Working Hours",
      value: attendance?.actual || "56 H : 00 M",
    },

    {
      title: "Remaining Working Hours",
      value: attendance?.remaining || "144 H : 00 M",
    },

    {
      title: "Total Early Out",
      value: attendance?.earlyOut || "00 H : 00 M",
    },

    {
      title: "Total Overtime Hours",
      value: attendance?.overtime || "02 H : 06 M",
    },
  ];

  return (
    <div
      className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-4
"
    >
      {data.map((item, index) => (
        <div
          key={index}
          className="
bg-white
rounded-2xl
p-5
shadow-sm
border
border-slate-100
"
        >
          <p className="text-xs text-slate-400 font-semibold">{item.title}</p>

          <h2
            className="
text-2xl
font-bold
text-slate-800
mt-3
"
          >
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default WorkingHoursCards;
