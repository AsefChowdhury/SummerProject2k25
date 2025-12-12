import { privateApi } from "../api";
import { useToast } from "../components/toast/toast";
import { useAuth } from "./AuthContext";

export default function useRefreshToken() {
    const { setAuth } = useAuth();
    const toast = useToast();

    const refresh = async () => {
        try {

            const response = await privateApi.post('/api/token/refresh/');
            
            if (response.status === 200) {
                setAuth({accessToken: response.data.access});
                return response.data.access;
            } else {
                setAuth(null);
                return;
            }

        } catch (error) {
            setAuth(null);
            toast?.addToast({message: "Something went wrong whilst refreshing your session, please sign in again", type: "error"});
            return;
        }
    }

    return refresh;
}