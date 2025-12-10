import { createContext, useContext } from "react";

export const AuthContext = createContext<{ isAuthorised: boolean | null; setIsAuthorised: React.Dispatch<React.SetStateAction<boolean | null>>}>({ isAuthorised: null, setIsAuthorised: () => {} });

export const useAuth = () => {
    return useContext(AuthContext);
};