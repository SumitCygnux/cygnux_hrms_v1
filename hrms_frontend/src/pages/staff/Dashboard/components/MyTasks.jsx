const MyTasks = ({ tasks = [] }) => {
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
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-800">My Tasks</h3>

        <button className="text-xs text-blue-500">View</button>
      </div>

      {tasks.length > 0 ? (
        <div className="mt-5 space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="
bg-slate-50
rounded-xl
p-4
flex
justify-between
items-center
"
            >
              <div>
                <p
                  className="
text-sm
font-semibold
text-slate-700
"
                >
                  {task.title}
                </p>

                <p
                  className="
text-xs
text-slate-400
mt-1
"
                >
                  {task.description}
                </p>
              </div>

              <span
                className="
text-[10px]
bg-blue-100
text-blue-600
px-3
py-1
rounded-full
"
              >
                {task.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="
text-center
py-8
text-sm
text-slate-400
"
        >
          No task found
        </div>
      )}
    </div>
  );
};

export default MyTasks;
