import axios from 'axios';
import { API_URL } from '../../config/firebase';

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw new Error('Registration failed');
    }
};

export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, userData);
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw new Error('Login failed');
    }
};  
        