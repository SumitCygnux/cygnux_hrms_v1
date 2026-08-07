export const leftPanelData = {
  workingHours: [
    { title: "Total Scheduled Hours", value: "40 hrs", icon: "clock", badge: "This Week", badgeVariant: "secondary" },
    { title: "Completed Hours", value: "34 hrs", icon: "check-circle", badge: "85%", badgeVariant: "success" },
    { title: "Overtime Hours", value: "2.5 hrs", icon: "alert-circle", badge: "+2.5 hrs", badgeVariant: "warning" }
  ],
  earlyOut: {
    title: "Early Out Reminder",
    date: "Today",
    time: "04:30 PM",
    reason: "Doctor Appointment (Approved)",
    badgeVariant: "warning"
  },
  lateArrival: {
    title: "Late Arrival",
    count: "2 Times",
    month: "This Month",
    lastLate: "12th Aug (15 mins)",
    badgeVariant: "danger"
  },
  attendanceSummary: {
    present: "18 Days",
    absent: "1 Day",
    halfDay: "1 Day",
    leave: "2 Days"
  },
  tasks: [
    { id: 1, title: "Submit Progress Report", priority: "High", status: "Pending", dueDate: "Today" },
    { id: 2, title: "Review UI/UX Design System", priority: "Medium", status: "Completed", dueDate: "Tomorrow" },
    { id: 3, title: "Client Feedback Fixes", priority: "Low", status: "In Progress", dueDate: "14th Aug" }
  ],
  leaveBalance: [
    { type: "Casual Leave", total: 12, used: 4, remaining: 8 },
    { type: "Sick Leave", total: 10, used: 2, remaining: 8 },
    { type: "Paid Leave", total: 15, used: 5, remaining: 10 }
  ],
  upcomingHolidays: [
    { name: "Independence Day", date: "15 Aug 2026", day: "Saturday" },
    { name: "Raksha Bandhan", date: "28 Aug 2026", day: "Friday" }
  ]
};