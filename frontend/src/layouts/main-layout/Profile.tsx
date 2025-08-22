import { useEffect, useRef, useState } from 'react';
import './main-layout-styles/Profile.css'
import settings from '../../assets/settings.svg?react'
import light from '../../assets/light.svg?react'
import dark from '../../assets/dark.svg?react'
import logout from '../../assets/logout.svg?react'
import { useNavigate } from 'react-router-dom';

function ProfileDropdown() {
    type DropdownItemProps = {
        icon?: React.FC<React.SVGProps<SVGSVGElement>>;
        text: string;
        onClick?: () => void
    };

    let navigate = useNavigate();

    const logoutUser = () => {
        localStorage.clear();
        navigate('/sign-in');
    }

    function DropdownItem(props: DropdownItemProps){
        return(
            <a className='dropdown-item' onClick={props.onClick}>
                {props.icon && <props.icon className='dropdown-item-icon' />}
                <span className='dropdown-item-text'>{props.text}</span>
            </a>
        )
    }

    return (
        <div className="profile-dropdown">
            <DropdownItem text={'Settings'} icon={settings}/>
            <DropdownItem text={'Light mode'} icon={light}/>
            <DropdownItem text={'Logout'} icon={logout} onClick={logoutUser}/>
        </div>
    )
}

function Profile() {
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!showDropdown) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        
    }, [showDropdown]);
    
    
    return (
        <div ref={containerRef} className="profile-container">
            <button className='profile-button' onClick={() => setShowDropdown(!showDropdown)}>Profile</button>

            {showDropdown &&
                <ProfileDropdown />
            }
        </div>
    )
}

export default Profile