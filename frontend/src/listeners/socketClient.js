import { io } from "socket.io-client";
import { API_URL } from "../../config/config";

export let socket = null;

export const connectSocket = () => {
    if (!socket) { 
        socket = io(API_URL || "http://localhost:5000", {
            withCredentials: true 
        });
    }
    return socket;
}

export const disconnectSocket = () => {
    if(socket) {
        socket.disconnect();
        socket = null;
    }
}