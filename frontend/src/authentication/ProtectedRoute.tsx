import { Navigate } from "react-router-dom";
import { type JSX } from "react";
import useAuthCheck from "./useAuthCheck";

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAuthorised } = useAuthCheck();
    if (isAuthorised === null) {
        return <h1>Loading...</h1>
    }

    return isAuthorised ? children : <Navigate to="/sign-in" />

}

export default ProtectedRoute