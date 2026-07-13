const NoticeBoard = ({ notices = [] }) => {
  return (
    <div
      className="
bg-white
rounded-3xl
p-5
border
"
    >
      <div className="flex justify-between">
        <h3 className="font-bold">Notice Board</h3>

        <span>({notices.length})</span>
      </div>

      {notices.length ? (
        notices.map((n) => (
          <div key={n.id} className="mt-4 bg-slate-50 p-3 rounded-xl">
            {n.title}
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400 mt-5">No Notice Found</p>
      )}
    </div>
  );
};

export default NoticeBoard;
