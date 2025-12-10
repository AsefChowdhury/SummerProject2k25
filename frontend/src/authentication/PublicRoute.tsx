import { Navigate } from "react-router-dom";
import { type JSX } from "react";
import { useAuth } from "./AuthContext";

function PublicRoute({ children }: { children: JSX.Element }) {
    const { isAuthorised } = useAuth();

    if (isAuthorised === null) {
        return <h1>Loading...</h1>
    }

    return isAuthorised ? <Navigate to="/dashboard" /> : children

}

export default PublicRoute