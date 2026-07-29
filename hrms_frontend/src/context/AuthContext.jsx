import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  const [permissions, setPermissions] = useState(
    JSON.parse(localStorage.getItem("permissions") || "[]"),
  );

  const login = (data) => {
    setToken(data.token);
    setUser(data.user);
    setPermissions(data.permissions || []);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("permissions", JSON.stringify(data.permissions || []));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPermissions([]);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        permissions,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
