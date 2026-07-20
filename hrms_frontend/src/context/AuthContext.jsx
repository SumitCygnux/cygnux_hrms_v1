import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [permissions, setPermissions] = useState(
    JSON.parse(localStorage.getItem("permissions")) || []
  );
  
  const login = (data) => {
    setToken(data.token);
    setPermissions(data.permissions);

    localStorage.setItem("token", data.token);
    localStorage.setItem("permissions", JSON.stringify(data.permissions));
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setPermissions([]);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ token, permissions, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);