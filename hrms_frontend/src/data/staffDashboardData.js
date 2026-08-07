export const staffData = {
  user: {
    name: "Alex Morgan",
    designation: "Senior UI/UX Designer",
    department: "Product Team",
    avatar: "https://i.pravatar.cc/150?img=33"
  },
  kpiStats: [
    { title: "Total Scheduled Hours", value: "40 hrs", icon: "clock", badge: "This Week", badgeVariant: "secondary" },
    { title: "Completed Hours", value: "34 hrs", icon: "check-circle", badge: "85%", badgeVariant: "success" },
    { title: "Overtime Hours", value: "2.5 hrs", icon: "alert-circle", badge: "+2.5 hrs", badgeVariant: "warning" }
  ],
  tasks: [
    { id: 1, title: "Submit Weekly Progress Report", dueDate: "Today", status: "Pending" },
    { id: 2, title: "Review UI/UX Design System", dueDate: "Tomorrow", status: "Completed" }
  ],
  activities: [
    { type: "Clock In", time: "09:00 AM", icon: "login" },
    { type: "Break Start", time: "01:00 PM", icon: "pause" },
    { type: "Break End", time: "01:45 PM", icon: "play" }
  ]
};