import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getMe } from '../service/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            console.log("call")
            const me = await getMe();
            if (me) setUser(me);
        }
        fetchUser();
    }, [])

    const Logout = () => {
        Cookies.remove("token");
        //nav("/")
        // setUser(null);
    };

    const value = { user, setUser };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => { return useContext(AuthContext); };