import SearchField from '../components/SearchField';
import './navigation-bar-styles/NavigationBar.css';
import Profile from './Profile';
import './navigation-bar-styles/TopSearchField.css';
import Notifications from './Notifications';

function NavigationBar() {
    return (
        <div className="navigation-bar">
            <h1 className='logo'>Logo</h1>
            <SearchField />
            <div className="buttons-container">
                <Notifications />
                <Profile />
            </div>
        </div>
    )
}

export default NavigationBar