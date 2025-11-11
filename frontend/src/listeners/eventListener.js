import { useSaveContent } from '../hooks/useSaveContent';
import { socket } from './socketClient';

socket.on("connect", () => {
    console.log('✅ Connected to server!')
});

socket.on("disconnect", () => {
    console.log("🔴 Disconnected from server");
});

socket.on("error-message", (msg) => {
    alert(error);
});

socket.on("success-message", (msg) => {
    alert(msg);
});


socket.on("receive-message", (msg) => {
    console.log(msg)
});