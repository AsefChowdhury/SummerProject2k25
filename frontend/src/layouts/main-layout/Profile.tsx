import { useState } from 'react';
import './main-layout-styles/Profile.css'
import settings from '../../assets/settings.svg?react'
import light from '../../assets/light.svg?react'
import dark from '../../assets/dark.svg?react'
import logoutIcon from '../../assets/logout.svg?react'
import Dropdown from '../../components/dropdown/Dropdown';
import DropdownItem from '../../components/dropdown/DropdownItem';
import { useAuth } from '../../authentication/AuthContext';
import useApi from '../../authentication/useApi';

function Profile() {
    const { setAuth } = useAuth();
    const api = useApi();
    const [dropdownAnchor, setDropdownAnchor] = useState<null | HTMLElement>(null);

    const logoutUser = async () => {
        handleClose();
        const response = await api.post('/api/user/logout/');

        if (response.status === 200) {
            setAuth(null);
        } 
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
            <button className='profile-button' onClick={handleClick}></button>
            <Dropdown anchor={dropdownAnchor as HTMLElement} open={dropdownAnchor !== null} onClose={handleClose} >
                <DropdownItem text={'Settings'} icon={settings} onClick={handleClose}/>
                <DropdownItem text={'Light mode'} icon={light}/>
                <DropdownItem className='logout' text={'Logout'} icon={logoutIcon} onClick={logoutUser}/>
            </Dropdown>
        </div>
    )
}

export default Profile