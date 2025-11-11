import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getMe } from "../service/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const me = await getMe();
          if (me) setUser(me);
        } catch (error) {
          Cookies.remove("token");
        }
      }
    };
    fetchUser();
  }, []);

  const login = async (token) => {
    Cookies.set("token", token);
    const me = await getMe();
    if (me) setUser(me);
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  const value = { user, login, logout, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};