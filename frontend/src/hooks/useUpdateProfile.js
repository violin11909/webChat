import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoomProfile } from '../service/roomService';
import { updateUserProfile } from '../service/userService';
import { useAuth } from "../contexts/AuthContext";

export const useUpdateRoomProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ filePath, roomId }) => updateRoomProfile(filePath, roomId),
        onMutate: async ({ filePath, roomId }) => {

            await queryClient.cancelQueries({ queryKey: ['rooms'] });

            const previousRooms = queryClient.getQueryData(['rooms']);

            queryClient.setQueryData(['rooms'], (oldRooms) => {
                if (!oldRooms) return [];
                return oldRooms.map((room) =>
                    room._id === roomId ? { ...room, profile: filePath } : room
                );
            });
            console.log(filePath)

            return { previousRooms };
        },
        onError: (err, variables, context) => {
            if (context?.previousRooms) {
                queryClient.setQueryData(['rooms'], context.previousRooms);
            }
        },
        onSuccess: (updatedRoom) => {
            if (!updatedRoom) return;
            queryClient.setQueryData(['rooms'], (oldRooms) => {
                if (!oldRooms) return [];
                return oldRooms.map((room) => room._id === updatedRoom._id ? updatedRoom : room);
            });
        },
    });
};

export const useUpdateUserProfile = () => {
    const { user, setUser } = useAuth();

    return useMutation({
        mutationFn: ({ filePath, userId }) => updateUserProfile(filePath, userId),
        onMutate: async ({ filePath, userId }) => {

            const previousData = user;
            
            setUser(prev => ({
                ...prev,
                profile: filePath
            }))

            return { previousData };
        },
        onError: (err, variables, context) => {
            if (context?.previousData) setUser(context.previousData);
        },
        onSuccess: (updatedUser) => {
            if (!updatedUser) return;
            setUser(updatedUser)


        },
    });
};

