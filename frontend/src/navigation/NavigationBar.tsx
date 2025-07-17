import SearchField from '../components/SearchField';
import './NavigationBar.css';

function NavigationBar() {
    return (
        <div className="navigation-bar">
            <h1 className='logo'>Logo</h1>
            <SearchField />
            <div>
                <button className='notification-button'>Notifs</button>
                <button className='profile-button'>Profile</button>
            </div>
        </div>
    )
}

export default NavigationBar