import { useSaveContent } from '../hooks/useSaveContent';

export const setupEventListeners = (socket, queryClient) => {
    socket.on("connect", () => {
        console.log('✅ Connected to server!')
    });

    socket.on("disconnect", () => {
        console.log("🔴 Disconnected from server");
    });

    socket.on("error-message", (msg) => {
        alert(msg);
    });

    socket.on("success-message", (msg) => {
        alert(msg);
    });

    socket.on("receive-message", (msg) => {
        console.log(msg)
    });

    socket.on("new-room", (newRoom) => {
        queryClient.setQueryData(['rooms'], (oldData) => {
            if (!oldData) return [newRoom];
            return [...oldData, newRoom];
        });
    });
}