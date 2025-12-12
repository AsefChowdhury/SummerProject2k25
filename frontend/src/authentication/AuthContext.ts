import { createContext, useContext } from "react";

export const AuthContext = createContext<{ auth: {accessToken: string} | null | undefined; setAuth: React.Dispatch<React.SetStateAction<{accessToken: string} | null | undefined>>}>({ auth: null, setAuth: () => {} });

export const useAuth = () => {
    return useContext(AuthContext);
};