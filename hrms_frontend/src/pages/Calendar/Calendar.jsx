import PageHeader from "../../components/layout/PageHeader";
import Badge from "../../components/common/Badge";

const Calendar = () => {
  // We represent the month of June 2026
  // June 1, 2026 is a Monday.
  // We have a Sun-Sat grid.
  // Grid starts with Sun (empty cell), then Mon 1, Tue 2, ...
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const totalDays = 30;
  const blanks = 1; // June 1st is Monday, so Sunday is blank.

  // Compile June 2026 Events
  const eventsByDay = {
    12: [{ type: "leave", title: "Sarah Connor (Leave)" }],
    13: [{ type: "leave", title: "Sarah Connor (Leave)" }],
    14: [{ type: "leave", title: "Sarah Connor (Leave)" }],
    15: [
      { type: "leave", title: "Sarah Connor (Leave)" },
      { type: "meeting", title: "Clock Simulation Day" }
    ],
    16: [{ type: "leave", title: "Sarah Connor (Leave)" }],
    17: [
      { type: "leave", title: "Sarah Connor (Leave)" },
      { type: "leave", title: "Barry Allen (Leave)" }
    ],
    18: [
      { type: "leave", title: "Sarah Connor (Leave)" },
      { type: "leave", title: "Barry Allen (Leave)" },
      { type: "meeting", title: "Townhall" }
    ],
    19: [{ type: "holiday", title: "Juneteenth" }],
    23: [{ type: "meeting", title: "Design Feedback Review" }],
    25: [{ type: "leave", title: "Diana Prince (Leave)" }],
    26: [{ type: "leave", title: "Diana Prince (Leave)" }],
    27: [{ type: "social", title: "Summer Picnic" }]
  };

  const renderCells = () => {
    const cells = [];

    // Render blanks
    for (let i = 0; i < blanks; i++) {
      cells.push(<div key={`blank-${i}`} className="bg-bg-primary/50 border-r border-b border-border-color" />);
    }

    // Render day cells
    for (let day = 1; day <= totalDays; day++) {
      const dayEvents = eventsByDay[day] || [];
      const isToday = day === 15; // Today is simulated as June 15, 2026

      cells.push(
        <div key={day} className={`min-h-[100px] p-2 border-r border-b border-border-color relative flex flex-col gap-1 transition-colors duration-150 hover:bg-bg-primary ${isToday ? "bg-primary/10" : "bg-bg-secondary"}`}>
          <span className={`text-xs font-semibold ${isToday ? "text-primary font-extrabold" : "text-text-secondary"}`}>{day}</span>
          <div className="flex flex-col gap-0.5 overflow-hidden">
            {dayEvents.map((ev, idx) => {
              let classType = "bg-primary/10 text-primary";
              if (ev.type === "holiday") classType = "bg-danger/10 text-danger";
              else if (ev.type === "leave") classType = "bg-warning/10 text-warning";
              else if (ev.type === "social") classType = "bg-success/10 text-success";

              return (
                <div key={idx} className={`text-[10px] px-1.5 py-0.5 rounded font-semibold truncate ${classType}`} title={ev.title}>
                  {ev.title}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Pad remaining cells for a clean grid (total 35 cells for June 2026: 1 blank + 30 days + 4 blanks)
    const remaining = 35 - cells.length;
    for (let i = 0; i < remaining; i++) {
      cells.push(<div key={`remaining-${i}`} className="bg-bg-primary/50 border-r border-b border-border-color" />);
    }

    return cells;
  };

  return (
    <div>
      <PageHeader title="Company Calendar" subtitle="Consolidated views of leaves, holidays and announcements" />

      <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm">
        {/* Navigation / Month Title */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-text-primary">June 2026</h2>
          <div className="flex gap-4 items-center">
            <span className="text-xs text-gray-500 font-semibold">Legend:</span>
            <Badge status="Absent">Holidays</Badge>
            <Badge status="On Leave">Leaves</Badge>
            <Badge status="Active">Meetings</Badge>
            <Badge status="WFH">Social Events</Badge>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-7 border-l border-t border-border-color">
          {/* Weekday Titles */}
          <div className="col-span-7 grid grid-cols-7 bg-bg-primary text-center font-bold text-xs text-text-secondary">
            {weekdays.map((day) => (
              <div key={day} className="py-3 border-r border-b border-border-color uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          {renderCells()}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
