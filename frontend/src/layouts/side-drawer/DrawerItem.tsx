import './side-drawer-styles/DrawerItem.css'

type DrawerItemProps = {
    icon: string;
    text: string;
}

function DrawerItem(props: DrawerItemProps){
    return (
        <a className='drawer-item'>
            <img className='drawer-item-icon' src={props.icon} alt={props.text}/>
            <span className='drawer-item-text'>{props.text}</span>
        </a>
    )
}

export default DrawerItem