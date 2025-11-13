import axios from 'axios';
import { API_URL } from '../../config/config';

export const getMe = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/v1/auth/me`, { withCredentials: true });
        return response.data.data;
    } catch (err) {
        console.error(err)
        throw new Error("Authenticated failed");
    }
}

export const updateUserProfile = async ({ userId, name, filePath }) => {
    try {
        const res = await axios.put(`${API_URL}/api/v1/user/update-profile`, { userId, name, filePath });
        return res.data.data;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to change user profile")
    }
}

export const getUsers = async (name = '') => {
    try {
        const response = await axios.get(`${API_URL}/api/v1/user`, {
            params: { name },
            withCredentials: true
        });
        return response.data.data;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to fetch users");
    }
}