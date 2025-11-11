import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveContent } from '../service/roomService';

export const useSaveContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ roomId, content, type, senderId, createdAt }) => saveContent(roomId, content, type, senderId, createdAt),
        onMutate: async ({ roomId, content, type, senderId, createdAt }) => {

            await queryClient.cancelQueries({ queryKey: ['contents', roomId] });
            const previousContents = queryClient.getQueryData(['contents', roomId]);

            const optimisticMessage = {
                _id: crypto.randomUUID(),
                content: content,
                type: type,
                senderId: senderId,
                createdAt: createdAt,
                isOptimistic: true
            };

            queryClient.setQueryData(['contents', roomId], (oldContents) => {
                if (!oldContents) return [optimisticMessage];
                return [...oldContents, optimisticMessage];
            });

            return { previousContents, optimisticMessage };
        },

        onError: (err, variables, context) => {
            if (context?.previousContents) {
                queryClient.setQueryData(['contents', variables.roomId], context.previousContents);
            }
        },

        onSuccess: (savedContent, variables, context) => {
            if (!savedContent) return;

            queryClient.setQueryData(['contents', variables.roomId], (oldContents) => {
                if (!oldContents) return [];
                return oldContents.map((content) => content._id === context.optimisticMessage._id ? savedContent : content);
            });
        },
    });
};