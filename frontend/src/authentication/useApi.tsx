import { useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from '../constants';
import useRefreshToken from "./useRefreshToken";

export default function useApi() {
    const refresh = useRefreshToken();
    
    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use((config) => {
                const token = localStorage.getItem(ACCESS_TOKEN);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        const responseInterceptor = api.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error.response.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newToken = await refresh();
                    prevRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(prevRequest);
                }
                return Promise.reject(error);
            }
        );
        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    return api;
}