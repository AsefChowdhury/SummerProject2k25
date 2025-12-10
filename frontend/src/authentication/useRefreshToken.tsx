import { refreshApi } from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { useToast } from "../components/toast/toast";
import { useAuth } from "./AuthContext";
import { jwtDecode, type JwtPayload } from "jwt-decode";

export default function useRefreshToken() {
    const {setIsAuthorised} = useAuth();
    const toast = useToast();

    const refresh: () => Promise<string | null> = async () => {
        let token = localStorage.getItem(REFRESH_TOKEN);
        if (!token) {
            setIsAuthorised(false);
            return;
        }
        let decodedToken: JwtPayload;
        
        try {
            decodedToken = jwtDecode(token);

            const tokenExp = decodedToken.exp;
            const now = Date.now() / 1000;
            
            if (!tokenExp || now > tokenExp) {
                setIsAuthorised(false);
                toast?.addToast({message: "Your session has expired, please sign in again", type: "error"});
                return;
            }

            const response = await refreshApi.post('/api/token/refresh/', { 
                refresh: token 
            });
            
            if (response.status === 200) {
                setIsAuthorised(true);
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                return response.data.access;
            } else {
                setIsAuthorised(false);
                return;
            }

        } catch (error) {
            setIsAuthorised(false);
            toast?.addToast({message: "Something went wrong whilst refreshing your session, please sign in again", type: "error"});
            return;
        }
    }

    return refresh;
}