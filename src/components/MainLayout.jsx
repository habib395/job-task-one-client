import { useContext } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";

const MainLayout = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Protect all routes except "/login"
    if (!user && location.pathname !== "/login") {
        return <Navigate to="/login" replace />;
    }

    return (
        <div>
            <Outlet />
        </div>
    );
};

export default MainLayout;
