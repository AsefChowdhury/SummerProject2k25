import search from '../assets/search.svg';
import './SearchField.css';
import close from '../assets/close.svg';
import { useState } from 'react';

function SearchField () {
    const [searchTerm, setSearchTerm] = useState('');
    
    return (
        <div className="search-field-container">
            <input type="text" placeholder="Search" className="search-field" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            {searchTerm.length > 0 &&
                <button className="delete-button" onClick={() => setSearchTerm('')}>
                    <img src={close} alt="Close"/>
                </button>
            }
            <button className="search-button">
                <img src={search} alt="Search"/>
            </button>
        </div>
    )
}

export default SearchField