import { createContext, useContext, useState } from 'react';

const DrawerContext = createContext(null);

export function DrawerProvider({ children }) {
    const [drawerState, setDrawerState] = useState({
        isOpen: false,
        type: null,
        data: null,
    });

    const openDrawer = (type, data = null) => {
        setDrawerState({ isOpen: true, type, data });
    };
    const closeDrawer = () => {
        setDrawerState((prev) => ({ ...prev, isOpen: false }));
    };

    return (
        <DrawerContext.Provider value={{ drawerState, openDrawer, closeDrawer}}>
            {children}
        </DrawerContext.Provider>
    );
}

export function useDrawer() {
    const context = useContext(DrawerContext);
    if (!context) {
        throw new Error('useDrawer must be used within a DrawerProvider');
    }
    return context;
}