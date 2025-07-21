import './side-drawer-styles/SideDrawer.css'
import DrawerItem from './DrawerItem'
import type { ReactElement } from 'react'

type SideDrawerProps = {
    children: ReactElement<typeof DrawerItem> | ReactElement<typeof DrawerItem>[]
}

function SideDrawer({children}: SideDrawerProps) {
    
    return (
        <nav className="side-drawer">
            {children}
        </nav>
    )
}

export default SideDrawer