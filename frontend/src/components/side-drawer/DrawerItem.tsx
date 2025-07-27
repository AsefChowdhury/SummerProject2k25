import { NavLink } from 'react-router-dom';
import './side-drawer-styles/DrawerItem.css'

type DrawerItemProps = {
    icon: string;
    text: string;
    to: string;
    onClick?: () => void
}

function DrawerItem(props: DrawerItemProps){
    return (
        <NavLink className={({isActive}) => (isActive ? 'drawer-item active' : 'drawer-item')} to={props.to} onClick={props.onClick}>
            <img className='drawer-item-icon' src={props.icon} alt={props.text}/>
            {props.text}
        </NavLink>
    )
}

export default DrawerItem