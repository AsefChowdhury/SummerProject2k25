import { Outlet } from "react-router-dom"
import SideDrawer from "../../components/side-drawer/SideDrawer"
import menu from '../../assets/menu.svg?react'
import DrawerItem from "../../components/side-drawer/DrawerItem"
import './main-layout-styles/MainLayout.css'
import ButtonSearchField from "../../components/button-search-field/ButtonSearchField"
import Notifications from "./Notifications"
import ProfileButton from "./ProfileButton"
import NavigationBar from "../../components/navigation-bar/NavigationBar"
import IconButton from "../../components/IconButton/IconButton"
import { useState } from "react"
import CreationButton from "./CreationButton"
import arrow_back from "../../assets/arrow_back.svg?react"
import manage_account from "../../assets/manage_account.svg?react"

function SettingsLayout() {
    const [openDrawer, setOpenDrawer] = useState(false);
    
    return (
        <div className="main-layout">
            <NavigationBar>
                <div className="navbar-left">
                    <div className="menu-button">
                        <IconButton icon={menu} onClick={() => {setOpenDrawer(!openDrawer)}}/>
                    </div>
                    <h1 className='logo'>Logo</h1>
                </div>
                <div className="navbar-search">
                    <ButtonSearchField />
                </div>
                <div className="navbar-right">
                    <CreationButton/>
                    <Notifications />
                    <ProfileButton />
                </div>
                <div className="navbar-search-mobile">
                    <ButtonSearchField />
                </div>
            </NavigationBar>
            <div className="content-container">
                <SideDrawer type="temporary" open={openDrawer} onClose={() => {setOpenDrawer(false)}}>
                    <DrawerItem to="/dashboard" icon={arrow_back} text={'Back to dashboard'} onClick={() => {setOpenDrawer(false)}}/>
                    <DrawerItem to="/settings/account" icon={manage_account} text={'Account'} onClick={() => {setOpenDrawer(false)}}/>
                </SideDrawer>
                <SideDrawer type="permanent" open={openDrawer}>
                    <DrawerItem to="/dashboard" icon={arrow_back} text={'Back to dashboard'} />
                    <DrawerItem to="/settings/account" icon={manage_account} text={'Account'}/>
                </SideDrawer>
                <div className="page-content">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default SettingsLayout