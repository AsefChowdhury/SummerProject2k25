import { Outlet } from "react-router-dom"
import NavigationBar from "../navigation-bar/NavigationBar"
import SideDrawer from "./side-drawer/SideDrawer"
import dashboard from '../assets/dashboard.svg'
import notes from '../assets/notes.svg'
import flashcards from '../assets/flashcards.svg'
import quizzes from "../assets/quizzes.svg"
import DrawerItem from "./side-drawer/DrawerItem"
import './main-layout-styles/MainLayout.css'

function MainLayout() {
    return (
        <div className="main-layout">
            <NavigationBar />
            <div className="content-container">
                <SideDrawer>
                    <DrawerItem to="/" icon={dashboard} text={'Dashboard'}/>
                    <DrawerItem to="/flashcards" icon={flashcards} text={'Flashcards'}/>
                    <DrawerItem to="/notes" icon={notes} text={'Notes'}/>
                    <DrawerItem to="/quizzes" icon={quizzes} text={'Quizzes'}/>
                </SideDrawer>
                <div className="page-content">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default MainLayout