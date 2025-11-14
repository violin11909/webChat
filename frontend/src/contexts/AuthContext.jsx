import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getMe } from "../service/userService";
import { connectSocket, disconnectSocket } from "../listeners/socketClient";
import { setupEventListeners } from "../listeners/eventListener";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [listenersSetUp, setListenersSetUp] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const me = await getMe();
          if (me) {
            setUser(me);
            const socket = connectSocket();
            if (socket && !listenersSetUp) {
              setupEventListeners(socket, queryClient);
              setListenersSetUp(true);
            }
          }
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
    if (me) {
      setUser(me);
      const socket = connectSocket();
      if (socket && !listenersSetUp) {
        setupEventListeners(socket, queryClient);
        setListenersSetUp(true);
      }
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    disconnectSocket();
    setListenersSetUp(false);
  };

  const updateUser = (newUserData) => {
    setUser(prevUser => ({ ...prevUser, ...newUserData }));
  };

  const value = { user, login, logout, setUser, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};