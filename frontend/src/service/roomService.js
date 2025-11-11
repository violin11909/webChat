import axios from 'axios';
import { API_URL } from '../../config/firebase';

export const getRooms = async () => {
    try {
        const response = await axios.get(`${API_URL}/room`);
        const roomdata = response.data.data
        console.log(roomdata);
        //axios จะทำการ parse JSON ให้อัตโนมัติ ไม่ต้องมี .json
        return roomdata;
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

export const createRoom = async (name, isPrivate, member) => {
    try {
        const res = await axios.post(`${API_URL}/room`, { name, isPrivate, member }, { withCredentials: true });
        return res.data.data;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to create room")
    }
}