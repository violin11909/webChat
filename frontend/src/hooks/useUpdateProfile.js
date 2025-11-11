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

// export const useUpdateUserProfile = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: ({ filePath, userId }) => updateUserProfile(filePath, userId),
//         onMutate: async ({ filePath, userId }) => {
//             await queryClient.cancelQueries({ queryKey: ['user'] });

//             const previousUserData = queryClient.getQueryData(['user']);
//             queryClient.setQueryData(['user'], (oldData) => {
//                 if (!oldData) return null;
//                 return { ...oldData, profile: filePath }
//             })
//             console.log("new user  ")

//             return { previousUserData };
//         },
//         onError: (err, variables, context) => {
//             if (context?.previousUserData) queryClient.setQueryData(['user'], context.previousUserData);
//         },
//         onSuccess: (updatedUser) => {
//             if (!updatedUser) return;
//             queryClient.setQueryData(['user'], updatedUser)


//         },
//     });
// };

