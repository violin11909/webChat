import { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    return (
        <UIContext.Provider value={{ isEditingProfile, setIsEditingProfile }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    return useContext(UIContext);
}
