import './side-drawer-styles/SideDrawer.css'
import DrawerItem from './DrawerItem'
import { type ReactElement } from 'react'

type SideDrawerProps = {
    children: ReactElement<typeof DrawerItem> | ReactElement<typeof DrawerItem>[];
    type: "permanent" | "temporary";
    open: boolean
    onClose?: () => void
}

function SideDrawer(props: SideDrawerProps) {
    const drawer = {
        permanent: 
        <>
            <nav className="side-drawer">
                {props.children}
            </nav>
            <div className='side-drawer-spaceholder'/>
        </>,
        temporary:
        <>
            <nav className={`temporary-drawer ${props.open ? 'open' : ''}`}>
                {props.children}
            </nav>
            <div className={`drawer-overlay ${props.open ? 'active' : ''}` } onClick={props.onClose}></div>
        </>
    }
    return (
        drawer[props.type]
    )
}

export default SideDrawer