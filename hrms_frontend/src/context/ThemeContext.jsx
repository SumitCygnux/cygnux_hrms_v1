/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext();

// Light-only theme — dark mode is permanently disabled
export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("hrms-theme", "light");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {}, setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
