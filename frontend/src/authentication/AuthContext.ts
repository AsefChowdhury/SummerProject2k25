import { createContext, useContext } from "react";

export const AuthContext = createContext<{ auth: {accessToken: string} | null | undefined; persist: boolean; setPersist: React.Dispatch<React.SetStateAction<boolean>>; setAuth: React.Dispatch<React.SetStateAction<{accessToken: string} | null | undefined>>}>({ auth: null, persist: localStorage.getItem('persist') === 'true', setPersist: () => {}, setAuth: () => {} });

export const useAuth = () => {
    return useContext(AuthContext);
};