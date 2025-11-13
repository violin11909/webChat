import { io } from "socket.io-client";
import Cookies from 'js-cookie';

export let socket = null;

export const connectSocket = () => {
    const token = Cookies.get('token');
    if (token && !socket) {
        socket = io("http://localhost:5000", {
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

