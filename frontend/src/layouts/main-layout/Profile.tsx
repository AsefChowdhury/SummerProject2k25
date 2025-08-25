import { useState } from 'react';
import './main-layout-styles/Profile.css'
import settings from '../../assets/settings.svg?react'
import light from '../../assets/light.svg?react'
import dark from '../../assets/dark.svg?react'
import logout from '../../assets/logout.svg?react'
import { useNavigate } from 'react-router-dom';
import Dropdown from '../../components/dropdown/Dropdown';
import DropdownItem from '../../components/dropdown/DropdownItem';

function Profile() {
    const [dropdownAnchor, setDropdownAnchor] = useState<null | HTMLElement>(null);
    let navigate = useNavigate();

    const logoutUser = () => {
        handleClose();
        localStorage.clear();
        navigate('/sign-in');
    }
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (dropdownAnchor !== null) {
            setDropdownAnchor(null);
            return;
        }
        setDropdownAnchor(event.currentTarget);
    };

    const handleClose = () => {
        setDropdownAnchor(null);
    };
    
    return (
        <div className="profile-container">
            <button className='profile-button' onClick={handleClick}>Profile</button>
            <Dropdown anchor={dropdownAnchor as HTMLElement} open={dropdownAnchor !== null} onClose={handleClose} >
                <DropdownItem text={'Settings'} icon={settings} onClick={handleClose}/>
                <DropdownItem text={'Light mode'} icon={light}/>
                <DropdownItem className='logout' text={'Logout'} icon={logout} onClick={logoutUser}/>
            </Dropdown>
        </div>
    )
}

export default Profile