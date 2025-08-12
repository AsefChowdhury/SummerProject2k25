import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useEffect, useState } from "react";

function useAuthCheck() {
    const [isAuthorised, setIsAuthorised] = useState<boolean | null>(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorised(false));
    }, []);
    
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
            setIsAuthorised(false);
            return false;
        }

        try {
            const response = await api.post('/api/token/refresh/', { 
                refresh: refreshToken 
            });
            
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthorised(true);
                return true;
            } else {
                setIsAuthorised(false);
                return false;
            }
        } catch (error) {
            setIsAuthorised(false);
            console.log(error);
            return false;
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorised(false);
            return false;
        }

        const decodedToken = jwtDecode(token);
        const tokenExp = decodedToken.exp;
        const now = Date.now() / 1000;

        if (tokenExp! < now) {
            await refreshToken();
        } else {
            setIsAuthorised(true);
            return true;
        }

        console.log(isAuthorised);
    }

    return {isAuthorised};

}

export default useAuthCheck