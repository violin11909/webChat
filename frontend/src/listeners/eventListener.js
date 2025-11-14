import { useSaveContent } from '../hooks/useSaveContent';

export const setupEventListeners = (socket) => {
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
}