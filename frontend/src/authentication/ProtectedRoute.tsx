import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute() {
    const { isAuthorised } = useAuth();

    if (isAuthorised === null) {
        return <h1>Loading...</h1>
    }

    return isAuthorised ? <Outlet /> : <Navigate to="/sign-in" />

}

export default ProtectedRoute