const MyLeave = ({ leaves = [] }) => {
  const unpaid = leaves.find((l) => l.type === "UnPaid Leave");

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
      <div
        className="
flex
justify-between
items-center
"
      >
        <h3 className="font-bold">My Leave</h3>

        <button
          className="
bg-primary
text-white
text-xs
px-4
py-2
rounded-xl
"
        >
          Apply Leave
        </button>
      </div>

      <div
        className="
grid
grid-cols-1
sm:grid-cols-3
gap-4
mt-5
"
      >
        <div
          className="
bg-slate-50
rounded-2xl
p-4
"
        >
          <p className="text-xs text-slate-400">UnPaid Leave</p>

          <h2
            className="
text-xl
font-bold
mt-2
"
          >
            {unpaid?.balance || 0}
          </h2>
        </div>

        <div
          className="
bg-slate-50
rounded-2xl
p-4
"
        >
          <p className="text-xs text-slate-400">Balance</p>

          <h2
            className="
text-xl
font-bold
mt-2
"
          >
            {leaves.reduce((total, item) => total + item.balance, 0)}
          </h2>
        </div>

        <div
          className="
bg-slate-50
rounded-2xl
p-4
"
        >
          <p className="text-xs text-slate-400">Booked</p>

          <h2
            className="
text-xl
font-bold
mt-2
"
          >
            {leaves.reduce((total, item) => total + item.booked, 0)}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default MyLeave;
