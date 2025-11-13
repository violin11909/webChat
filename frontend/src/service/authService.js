import axios from 'axios';
import { API_URL } from '../../config/config';

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/api/v1/auth/register`, userData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw new Error('Registration failed');
    }
};

export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/api/v1/auth/login`, userData);
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw new Error('Login failed');
    }
};  
        