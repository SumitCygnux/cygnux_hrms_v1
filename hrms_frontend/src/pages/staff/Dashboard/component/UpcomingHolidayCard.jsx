import React, { useEffect, useState } from "react";
import { getHolidays } from "../../../../services/api";

export default function UpcomingHolidayCard() {
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);

  useEffect(() => {
    loadUpcomingHolidays();
  }, []);

const loadUpcomingHolidays = async () => {
  try {
    const res = await getHolidays();
    const holidays = res.data.data || [];

    const today = new Date().setHours(0, 0, 0, 0);
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    // Single line filtering
    const upcoming = holidays.filter((h) => {
      const hDate = new Date(h.holidayDate).setHours(0, 0, 0, 0);
      return hDate >= today && hDate <= oneMonthLater;
    });

    setUpcomingHolidays(upcoming);
  } catch (error) {
    console.error("Failed to load holidays:", error);
  }
};


  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700">
        Upcoming Holiday ({upcomingHolidays.length})
      </h3>

      {upcomingHolidays.length > 0 ? (
        upcomingHolidays.map((holiday) => (
          <div
            key={holiday.id}
            className="flex items-center gap-3 mt-4 p-2"
          >
            <div className="w-10 h-10 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">
                {holiday.holidayName}
              </p>

              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {new Date(holiday.holidayDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  weekday: "short",
                })}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-slate-500 mt-4">
          No upcoming holidays found.
        </p>
      )}
    </div>
  );
}