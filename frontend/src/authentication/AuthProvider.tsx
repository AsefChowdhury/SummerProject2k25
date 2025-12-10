import { jwtDecode, type JwtPayload } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

type AuthProviderProps = {
    children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthorised, setIsAuthorised] = useState<boolean | null>(null);

    const refresh = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
            setIsAuthorised(false);
            return;
        }

        try {
            const response = await api.post('/api/token/refresh/', { 
                refresh: refreshToken 
            });
            
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthorised(true);
                return;
            } else {
                setIsAuthorised(false);
                return;
            }
        } catch (error) {
            setIsAuthorised(false);
            return;
        }
    }

    useEffect(() => {
        
        const auth = async () => {
        
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token) {
                refresh();
                return;
            }
            let decodedToken: JwtPayload;
            
            try {
                decodedToken = jwtDecode(token);

                const tokenExp = decodedToken.exp;
                const now = Date.now() / 1000;
                
                if (!tokenExp || now > tokenExp) {
                    refresh();
                    return;
                } 
            } catch (error) {
                refresh();
                return;
            }
            
            try {
                const response = await api.post('/api/token/verify/', { 
                    token: token
                });
                
                if (response.status === 200) {
                    setIsAuthorised(true);
                    return;
                } else {
                    refresh();
                    return;
                }
            } catch (error) {
                setIsAuthorised(false);
                return;
            }
        }
        
        auth();
    }, []);

    return (
        <AuthContext value={{isAuthorised, setIsAuthorised}}>
            {children}
        </AuthContext>
    );
}