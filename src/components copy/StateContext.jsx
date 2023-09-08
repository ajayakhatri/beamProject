import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export function StateProvider({ children }) {
    const [sharedState, setSharedState] = useState({
        beamLength: window.matchMedia("(max-width: 725px)").matches ? 400 : 600,
    });

    return (
        <StateContext.Provider value={{ sharedState, setSharedState }}>
            {children}
        </StateContext.Provider>
    );
}

export function useStateValue() {
    return useContext(StateContext);
}
