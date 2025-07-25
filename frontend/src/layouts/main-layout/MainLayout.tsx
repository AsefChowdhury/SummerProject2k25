import { Outlet } from "react-router-dom"
import SideDrawer from "../../components/side-drawer/SideDrawer"
import dashboard from '../../assets/dashboard.svg'
import notes from '../../assets/notes.svg'
import menu from '../../assets/menu.svg'
import flashcards from '../../assets/flashcards.svg'
import quizzes from "../../assets/quizzes.svg"
import DrawerItem from "../../components/side-drawer/DrawerItem"
import './main-layout-styles/MainLayout.css'
import ButtonSearchField from "../../components/ButtonSearchField/ButtonSearchField"
import Notifications from "./Notifications"
import Profile from "./Profile"
import NavigationBar from "../../components/navigation-bar/NavigationBar"
import IconButton from "../../components/IconButton/IconButton"

function MainLayout() {
    return (
        <div className="main-layout">
            <NavigationBar>
                <div className="navbar-left">
                    <div className="menu-button">
                        <IconButton icon={menu} onClick={() => {console.log('test')}}/>
                    </div>
                    <h1 className='logo'>Logo</h1>
                </div>
                <div className="navbar-search">
                    <ButtonSearchField />
                </div>
                <div className="navbar-right">
                    <Notifications />
                    <Profile />
                </div>
                <div className="navbar-search-mobile">
                    <ButtonSearchField />
                </div>
            </NavigationBar>
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