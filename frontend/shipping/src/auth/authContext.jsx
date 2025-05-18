import React, { createContext, useContext, useState, useEffect } from "react";
import api, { bindTokenGetter } from "./api";

const AuthCtx = createContext();
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [access, setAccess] = useState(() => localStorage.getItem("access"));

  bindTokenGetter(() => access);

  // كلما تغيّر access نحدّث localStorage (حفظ أو حذف)
  useEffect(() => {
    if (access) {
      localStorage.setItem("access", access);
    } else {
      localStorage.removeItem("access");
    }
  }, [access]);

  // نستمع لأحداث تجديد التوكن أو انتهاء صلاحية refresh token
  useEffect(() => {
    const handleNewAccessToken = (e) => setAccess(e.detail);
    const handleLogoutByRefreshExpired = () => setAccess(null);

    window.addEventListener("NEW_ACCESS_TOKEN", handleNewAccessToken);
    window.addEventListener("LOGOUT_BY_REFRESH_EXPIRED", handleLogoutByRefreshExpired);

    return () => {
      window.removeEventListener("NEW_ACCESS_TOKEN", handleNewAccessToken);
      window.removeEventListener("LOGOUT_BY_REFRESH_EXPIRED", handleLogoutByRefreshExpired);
    };
  }, []);

  const login = (token) => setAccess(token);
  const logout = () => setAccess(null);

  return (
    <AuthCtx.Provider value={{ isAuth: !!access, access, login, logout, api }}>
      {children}
    </AuthCtx.Provider>
  );
}
