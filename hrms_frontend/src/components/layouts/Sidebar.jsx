import { NavLink } from "react-router-dom";
import logo from "../../assets/logowhite.png";

import {
  MdDashboard,
  MdPeople,
  MdAccessTime, 
  MdEventBusy,
  MdPayments,
  MdStarBorder,
  MdWorkOutline,
  MdBusiness,
  MdBadge,
  MdAssessment,
  MdCalendarToday,
  MdSettings,
  MdMenuOpen,
  MdMenu,
} from "react-icons/md";


const iconRegistry = {
  MdDashboard: <MdDashboard />,
  MdPeople: <MdPeople />,
  MdAccessTime: <MdAccessTime />,
  MdEventBusy: <MdEventBusy />,
  MdPayments: <MdPayments />,
  MdStarBorder: <MdStarBorder />,
  MdWorkOutline: <MdWorkOutline />,
  MdBusiness: <MdBusiness />,
  MdBadge: <MdBadge />,
  MdAssessment: <MdAssessment />,
  MdCalendarToday: <MdCalendarToday />,
  MdSettings: <MdSettings />,
};

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  

  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
  return (
    <>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-bg-sidebar text-gray-400 flex flex-col border-r border-border-color z-50 shadow-lg transition-all duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "w-[72px]" : "w-[260px]"}`}
      >
       
     
        <div className="h-[70px] flex items-center justify-center px-6 border-b border-white/5 shrink-0">
          <img
            src={logo}
            alt="HRMS Logo"
            className="h-22 w-auto object-contain"
          />
        </div>

 
        <nav className="flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-1">
          {permissions.map((item) => {
            
          
            if (!item.operations?.view) return null;

            
            const currentIcon = iconRegistry[item.icon] || <MdDashboard />;

            return (
              <NavLink
                key={item.id} 
                to={item.path} 
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg hover:bg-bg-sidebar-hover hover:text-white transition-all text-sm font-medium gap-3 whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.3)]"
                      : "text-gray-400"
                  }`
                }
                onClick={() => setIsMobileOpen(false)}
              >
               
                <span className="text-xl shrink-0">{currentIcon}</span>
                
                <span
                  className={`transition-opacity duration-300 ${
                    isCollapsed ? "opacity-0 w-0 overflow-hidden pointer-events-none" : "opacity-100"
                  }`}
                >
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

    
        <div className="p-4 border-t border-white/5 flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:bg-bg-sidebar-hover hover:text-white text-xl p-2 rounded-full w-9 h-9 flex items-center justify-center transition-all hidden md:flex"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <MdMenu /> : <MdMenuOpen />}
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
