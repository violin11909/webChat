import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoomProfile } from '../service/roomService';

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
        onError: (err, newRoom, context) => {
            if (context?.previousRooms) {
                queryClient.setQueryData(['rooms'], context.previousRooms);
            }
        },
        onSuccess: (updatedRoom) => {
            if (!updatedRoom) { //ไม่น่าเกิด เเต่เผื่อไว้ (backend คืนค่า undefinedมา) 
                alert("Failed to update profile ")
                queryClient.invalidateQueries({ queryKey: ['rooms'] });
                window.location.reload()
                return;
            }

            queryClient.setQueryData(['rooms'], (oldRooms) => {
                if (!oldRooms) return [];
                return oldRooms.map((room) => room._id === updatedRoom._id ? updatedRoom : room);
            });
        },
    });
};