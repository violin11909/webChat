import axios from 'axios';
import { API_URL } from '../../config/firebase';

export const getMe = async () => {
    try {
        const response = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        return response.data.data;
    } catch (err) {
        console.error(err)
        throw new Error("Authenticated failed");
    }
}

export const updateUserProfile = async (filePath, userId) => {
    try {
        const res = await axios.put(`${API_URL}/user/update-profile`, { filePath, userId });
        return res.data.data;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to change user profile")
    }
}

export const getUsers = async (name = '') => {
    try {
        const response = await axios.get(`${API_URL}/user`, {
            params: { name },
            withCredentials: true
        });
        return response.data.data;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to fetch users");
    }
}