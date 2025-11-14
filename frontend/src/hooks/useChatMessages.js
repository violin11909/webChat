import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { getContentsByRoomId } from '../service/roomService';
import { socket } from '../listeners/socketClient';

export function useChatMessages(roomId) {
    const queryClient = useQueryClient();

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['contents', roomId],
        queryFn: ({ pageParam = 1 }) => getContentsByRoomId(roomId, pageParam),
        getNextPageParam: (lastPage) => {
            const { pagination } = lastPage;
            return pagination.page < pagination.totalPages 
                ? pagination.page + 1 
                : undefined;
        },
        initialPageParam: 1,
        enabled: !!roomId,
    });

    const contents = useMemo(
        () => data?.pages.reduce((acc, page) => [...page.data, ...acc], []) ?? [],
        [data]
    );

    useEffect(() => {
        if (!roomId) return;

        const handleReceiveMessage = (msg) => {
            queryClient.setQueryData(['contents', roomId], (oldData) => {
                if (!oldData) return oldData;

                const newPages = oldData.pages.map((page, pageIndex) => {
                    if (pageIndex === 0) {
                        const isExisting = page.data.some(content => content._id === msg._id);
                        if (isExisting) return page;
                        return { ...page, data: [...page.data, msg] };
                    }
                    return page;
                });

                return { ...oldData, pages: newPages };
            });
        };

        const handleReceiveEmoji = (msg) => {
            queryClient.setQueryData(['contents', roomId], (oldData) => {
                if (!oldData) return oldData;

                const newPages = oldData.pages.map(page => ({
                    ...page,
                    data: page.data.map(content => 
                        content._id === msg._id ? msg : content
                    )
                }));

                return { ...oldData, pages: newPages };
            });
        };

        socket.on('receive-message', handleReceiveMessage);
        socket.on('receive-emoji', handleReceiveEmoji);

        return () => {
            socket.off('receive-message', handleReceiveMessage);
            socket.off('receive-emoji', handleReceiveEmoji);
        };
    }, [queryClient, roomId]);

    return {
        contents,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    };
}