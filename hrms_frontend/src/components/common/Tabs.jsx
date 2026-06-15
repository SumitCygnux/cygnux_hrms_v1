const Tabs = ({ tabs = [], activeTab, setActiveTab, className = "" }) => {
  return (
    <div className={`flex border-b border-border-color mb-6 gap-6 overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const id = tab.id || tab.name;
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-1 py-3 text-sm font-semibold text-text-secondary border-b-2 border-transparent transition-all cursor-pointer whitespace-nowrap hover:text-primary ${
              isActive ? "text-primary border-primary" : ""
            }`}
          >
            {tab.label || tab.name}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
