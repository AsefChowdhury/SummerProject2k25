import { Navigate, Outlet } from "react-router-dom";
import useAuthCheck from "./useAuthCheck";

function ProtectedRoute() {
    const { isAuthorised } = useAuthCheck();
    if (isAuthorised === null) {
        return <h1>Loading...</h1>
    }

    return isAuthorised ? <Outlet /> : <Navigate to="/sign-in" />

}

export default ProtectedRoute