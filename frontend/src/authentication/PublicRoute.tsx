import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

function PublicRoute() {
    const { auth } = useAuth();
    if (auth === undefined) {
        return <h1>Loading...</h1>
    }

    return auth !== null ? <Navigate to="/dashboard" /> : <Outlet />

}

export default PublicRoute