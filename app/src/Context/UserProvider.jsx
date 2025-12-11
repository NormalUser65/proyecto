import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import UserContext from "./UserContext";

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(token ? jwtDecode(token) : null);

  const saveUser = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(jwtDecode(newToken));
  };

  const clearUser = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const decodeToken = () => {
    if (!token) return null;
    return jwtDecode(token);
  };

  const authorize = (requiredRoles) => {
    if (!user) return false;
    console.log("DEBUG authorize user:", user);

    if (user.rol && typeof user.rol === "object" && user.rol.name) {
      return requiredRoles.includes(user.rol.name);
    }
    if (typeof user.rol === "string") {
      return requiredRoles.includes(user.rol);
    }
    if (user.role) {
      return requiredRoles.includes(user.role);
    }
    return false;
  };

  const isAuthenticated = !!token;

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        saveUser,
        clearUser,
        decodeToken,
        authorize,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
