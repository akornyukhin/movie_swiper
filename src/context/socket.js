import { createContext, useContext } from 'react'

export const SocketContext = createContext();

export function useSocket() {
    return useContext(SocketContext);
}
