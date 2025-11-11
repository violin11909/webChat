import axios from 'axios';
import { API_URL } from '../../config/firebase';

export const getRooms = async () => {
    try {
        const res = await axios.get(`${API_URL}/room`);
        return res.data.data;

    } catch (err) {
        return [];
    }

}

export const updateRoomProfile = async (filePath, roomId) => {
    try {
        const res = await axios.put(`${API_URL}/room/update-profile`, { filePath, roomId });
        return res.data.data;

    } catch (err) {
        console.error(err);
        throw new Error("Failed to change room profile")
    }

}


export const getContentsByRoomId = async (roomId) => {
    try {
        if (!roomId) {
            console.error("Missing room Id");
            return;
        }
        const res = await axios.get(`${API_URL}/room/content/${roomId}`);
        return res.data.data;

    } catch (err) {
        console.error(err);
        throw new Error("Failed to change room profile")
    }

}

export const saveContent = async (roomId, content, type, senderId, createdAt) => {
    try {
        if (!roomId) {
            console.error("Missing room Id");
            return;
        }

        const res = await axios.post(`${API_URL}/room/save-content`, { roomId, content, type, senderId, createdAt });
        return res.data.data;

    } catch (err) {
        console.error(err);
        throw new Error("Failed to save content")
    }

}

export const joinRoom = async (roomId, userId) => {
    try {
        if (!roomId || !userId) {
            console.error("Missing data");
            return;
        }

        const res = await axios.post(`${API_URL}/room/join-room`, { roomId, userId });
        return res.data;

    } catch (err) {
        console.error(err);
        throw new Error("Failed to save content")
    }

}
