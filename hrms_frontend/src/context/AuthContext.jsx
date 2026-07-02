import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {

    const userData = JSON.parse(localStorage.getItem("user"));
    const permissionData = JSON.parse(localStorage.getItem("permissions"));
    const tokenData = localStorage.getItem("token");

    if (userData) setUser(userData);
    if (permissionData) setPermissions(permissionData);
    if (tokenData) setToken(tokenData);

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        token,
        setUser,
        setPermissions,
        setToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);