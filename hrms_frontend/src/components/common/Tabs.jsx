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
           className={`relative px-1 py-3 text-sm font-semibold transition-all whitespace-nowrap
              ${
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-text-secondary border-b-2 border-transparent hover:text-blue-600"
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
