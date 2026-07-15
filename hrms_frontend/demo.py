
{
 identifier:"leave",
 children:[
  {
    name:"My Leave",
    path:"/leave/my-leave"
  },
  {
    name:"Employee Leave",
    path:"/leave/employee-leave",
    permission:"approve"
  },
  {
    name:"Team Leave",
    path:"/leave/team-leave",
    permission:"team"
  }
 ]
},

{
 identifier:"attendance",
 children:[
  {
    name:"My Attendance",
    path:"/attendance/my"
  },
  {
    name:"Attendance Report",
    path:"/attendance/report",
    permission:"viewReport"
  }
 ]

}