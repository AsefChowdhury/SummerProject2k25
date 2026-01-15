import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute() {
    const { auth } = useAuth();

    if (auth === undefined) {
        return <h1>Loading...</h1>
    }

    return auth !== null ? <Outlet /> : <Navigate to="/auth/sign-in" />

}

export default ProtectedRoute