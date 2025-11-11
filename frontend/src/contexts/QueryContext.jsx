import { createContext, useContext } from "react";

import { getRooms } from '../service/roomService';
import { useQuery } from "@tanstack/react-query";

const QueryContext = createContext();

export const QueryProvider = ({ children }) => {

    const { data: rooms, isLoading: isRoomLoading, isError: isRoomError, } = useQuery({
        queryKey: ['rooms'], queryFn: () => getRooms(), enabled: true, //should be !!user
    });


    // const getChatByRoomId = (roomId) => {
    //     const { data: contents, isLoading: isContentLoading, isError: isContentError, } = useQuery({
    //         queryKey: ['contents', roomId], queryFn: () => getRooms(), enabled: !!roomId, //should be !!user
    //     });

    //     return { contents, isContentLoading, isContentError };

    // }
    //ห้ามเรียก Hooks ในฟังก์ชันธรรมดา !!!!!!!!!



    const value = { rooms  };

    return <QueryContext.Provider value={value}>{children}</QueryContext.Provider>;
};

export const useQueryData = () => {
    return useContext(QueryContext);
};