import { createContext, useContext } from 'react'

export const GameContext = createContext();

export function useGame() {
    return useContext(GameContext);
}