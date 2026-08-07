
import React from "react";
import LeftSection from "./component/LeftSection";
import RightSection from "./component/RightSection";

export default function StaffDashboard() {
  return (
<div className="w-full h-screen p-0 m-0 bg-slate-50 flex flex-col-reverse lg:flex-row gap-2 overflow-y-auto lg:overflow-hidden"> 
  <LeftSection />
  <RightSection />
</div>
  );
}
