import { createContext, useContext } from "react";

import { getRooms } from '../service/roomService';
import { useQuery } from "@tanstack/react-query";
import { getUsers } from '../service/userService';
import { useAuth } from "./AuthContext";

const QueryContext = createContext();

export const QueryProvider = ({ children }) => {
    const { data: rooms } = useQuery({ queryKey: ['rooms'], queryFn: () => getRooms(), enabled: true, });
    const { data: users } = useQuery({ queryKey: ['users'], queryFn: () => getUsers(), enabled: true });
    const { data: onlineUsers } = useQuery({
        queryKey: ['online-users'], queryFn: () => [],
        enabled: true,
        // มันจะไม่พยายาม refetch อัตโนมัติ (ไม่ว่าจะ focus, ต่อเน็ตใหม่, หรือ mount ใหม่)
        staleTime: Infinity,
    });

    const value = { rooms, users, onlineUsers };

    return <QueryContext.Provider value={value}>{children}</QueryContext.Provider>;
};

export const useQueryData = () => {
    return useContext(QueryContext);
};