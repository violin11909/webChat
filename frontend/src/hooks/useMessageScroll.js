import { useRef, useEffect, useLayoutEffect } from 'react';

export function useMessageScroll(contents, isLoading, roomId) {
    const messagesEndRef = useRef(null);
    const scrollState = useRef({
        isInitialLoad: true,
        prevScrollHeight: 0
    });

    useEffect(() => {
        scrollState.current.isInitialLoad = true;
    }, [roomId]);

    useLayoutEffect(() => {
        const container = messagesEndRef.current;
        if (!container || isLoading) return;

        if (scrollState.current.isInitialLoad) {
            container.scrollTop = container.scrollHeight;
            scrollState.current.isInitialLoad = false;
        } else {
            const scrollOffset = container.scrollHeight - scrollState.current.prevScrollHeight;
            if (scrollOffset > 0) {
                container.scrollTop += scrollOffset;
            }
        }

        scrollState.current.prevScrollHeight = container.scrollHeight;
    }, [contents, isLoading]);

    return messagesEndRef;
}