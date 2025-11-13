import { io } from "socket.io-client";
import Cookies from 'js-cookie';
import { API_URL } from "../../config/config";

export let socket = null;

export const connectSocket = () => {
    const token = Cookies.get('token');
    if (token && !socket) {
        socket = io(API_URL || "http://localhost:5000", {
            auth: {
                token: token
            }
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

