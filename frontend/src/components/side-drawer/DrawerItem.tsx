import { NavLink } from 'react-router-dom';
import './side-drawer-styles/DrawerItem.css'

type DrawerItemProps = {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    text: string;
    to: string;
    onClick?: () => void
}

function DrawerItem(props: DrawerItemProps){
    return (
        <NavLink className={({isActive}) => (isActive ? 'drawer-item active' : 'drawer-item')} to={props.to} onClick={props.onClick}>
            {props.icon && 
                <props.icon className="icon-svg" />}
            {props.text}
        </NavLink>
    )
}

export default DrawerItem