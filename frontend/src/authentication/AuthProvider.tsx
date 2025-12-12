import { jwtDecode, type JwtPayload } from "jwt-decode";
import { privateApi } from "../api";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

type AuthProviderProps = {
    children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [auth, setAuth] = useState<{accessToken: string} | null | undefined>(undefined);

    const refresh = async () => {
        try {
            const response = await privateApi.post('/api/token/refresh/');
            
            if (response.status === 200) {
                setAuth({accessToken: response.data.access});
                return;
            } else {
                setAuth(null);
                return;
            }
        } catch (error) {
            setAuth(null);
            return;
        }
    }

    useEffect(() => {
        
        const authorise = async () => {
        
            const token = auth?.accessToken;
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
                const response = await privateApi.post('/api/token/verify/', { 
                    token: token
                });
                
                if (response.status === 200) {
                    setAuth({accessToken: token});
                    return;
                } else {
                    refresh();
                    return;
                }
            } catch (error) {
                setAuth(null);
                return;
            }
        }
        
        authorise();
    }, []);

    return (
        <AuthContext value={{auth: auth, setAuth: setAuth}}>
            {children}
        </AuthContext>
    );
}