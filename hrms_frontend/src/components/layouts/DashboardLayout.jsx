import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-200 transition-all duration-300">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ml-0 ${
          isCollapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        }`}
      >
        <Navbar onMobileToggle={() => setIsMobileOpen(!isMobileOpen)} />
        <main className="flex-1 p-5 md:p-[30px] max-w-[1500px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
