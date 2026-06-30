import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "../../../components/layouts/PageHeader";
import Badge from "../../../components/common/Badge";
import { MdCalendarToday, MdChevronLeft, MdChevronRight, MdEvent, MdBeachAccess } from "react-icons/md";

const events = [
  { date: "2026-06-18", title: "Quarterly Townhall", type: "Meeting", time: "10:00 AM" },
  { date: "2026-06-19", title: "Juneteenth Holiday", type: "Holiday", time: "Full Day" },
  { date: "2026-06-23", title: "Design Feedback Review", type: "Workshop", time: "2:00 PM" },
  { date: "2026-06-25", title: "Casual Leave", type: "Leave", time: "Full Day" },
  { date: "2026-06-26", title: "Casual Leave", type: "Leave", time: "Full Day" },
  { date: "2026-06-27", title: "Company Summer Picnic", type: "Social", time: "11:00 AM" },
  { date: "2026-07-04", title: "Independence Day", type: "Holiday", time: "Full Day" },
];

const eventTypeColor = {
  Meeting: { dot: "bg-primary", badge: "Active" },
  Holiday: { dot: "bg-danger", badge: "Absent" },
  Workshop: { dot: "bg-warning", badge: "Pending" },
  Leave: { dot: "bg-amber-400", badge: "On Leave" },
  Social: { dot: "bg-success", badge: "WFH" },
};

const StaffCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // June 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const today = new Date();
  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date("2026-06-18"))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0,6)

  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle="Your schedule, holidays, and upcoming events"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="xl:col-span-2 bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"
            >
              <MdChevronLeft className="text-slate-600 text-xl" />
            </button>
            <h2 className="text-lg font-bold text-slate-800">
              {monthName} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"
            >
              <MdChevronRight className="text-slate-600 text-xl" />
            </button>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-7 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-bold text-slate-400 py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dayEvents = getEventForDay(day);
              const today_ = isToday(day);
              return (
                <motion.div
                  key={day}
                  whileHover={{ scale: 1.04 }}
                  className={`relative min-h-[64px] rounded-xl p-1.5 cursor-pointer border transition-all ${
                    today_
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                      : dayEvents.length > 0
                      ? "bg-blue-50/60 border-blue-100"
                      : "border-transparent hover:bg-slate-50 hover:border-slate-100"
                  }`}
                >
                  <span
                    className={`text-xs font-bold block text-center mb-1 ${
                      today_ ? "text-white" : "text-slate-700"
                    }`}
                  >
                    {day}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {dayEvents.slice(0, 2).map((ev, ei) => (
                      <div
                        key={ei}
                        className={`w-full h-1 rounded-full ${eventTypeColor[ev.type]?.dot || "bg-slate-300"}`}
                      />
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-slate-400 text-center">+{dayEvents.length - 2}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-slate-100">
            {Object.entries(eventTypeColor).map(([type, config]) => (
              <div key={type} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                <span className="text-xs text-slate-500 font-medium">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Panel */}
        <div className="bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-5">
            <MdEvent className="text-primary text-lg" />
            <span className="text-base font-bold text-slate-800">Upcoming Events</span>
          </div>
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
            {upcomingEvents.map((ev, idx) => (
              <motion.div
                key={`${ev.date}-${idx}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="flex items-center gap-3 p-3 bg-slate-50/60 rounded-xl border border-slate-100 hover:border-blue-200 transition-all hover:translate-x-0.5"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-base flex-shrink-0">
                  {ev.type === "Holiday" ? <MdBeachAccess /> : <MdCalendarToday />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{ev.title}</p>
                  <p className="text-[10px] text-slate-400">{ev.time} · {ev.date}</p>
                </div>
                <Badge status={eventTypeColor[ev.type]?.badge || "neutral"}>{ev.type}</Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffCalendar;
