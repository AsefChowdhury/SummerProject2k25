import { Navigate } from "react-router-dom";
import { type JSX } from "react";
import { useAuth } from "./AuthContext";

function PublicRoute({ children }: { children: JSX.Element }) {
    const { auth } = useAuth();

    if (auth === undefined) {
        return <h1>Loading...</h1>
    }

    return auth !== null ? <Navigate to="/dashboard" /> : children

}

export default PublicRoute