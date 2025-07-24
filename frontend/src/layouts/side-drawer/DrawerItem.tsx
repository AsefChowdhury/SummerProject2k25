import { NavLink } from 'react-router-dom';
import './side-drawer-styles/DrawerItem.css'

type DrawerItemProps = {
    icon: string;
    text: string;
    to: string;
}

function DrawerItem(props: DrawerItemProps){
    return (
        <NavLink className={({isActive}) => (isActive ? 'drawer-item active' : 'drawer-item')} to={props.to}>
            <img className='drawer-item-icon' src={props.icon} alt={props.text}/>
            {props.text}
        </NavLink>
        // <a className='drawer-item'>
        // </a>
    )
}

export default DrawerItem