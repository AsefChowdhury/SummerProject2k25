import { Outlet } from "react-router-dom"
import NavigationBar from "../navigation/NavigationBar"

function MainLayout() {
    return (
        <div>
            <NavigationBar />
            <Outlet />
        </div>
    )
}

export default MainLayout