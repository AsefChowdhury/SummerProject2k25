import search from '../assets/search.svg';
import close from '../assets/close.svg';
import { useState } from 'react';

function SearchField () {
    const [searchTerm, setSearchTerm] = useState('');
    
    const handleSearch = () => {
        if(searchTerm.length <= 0){
            return;
        }
        console.log(searchTerm)
    }
    return (
        <div className="search-field-container">
            <input type="text" placeholder="Search" className="search-field" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            {searchTerm.length > 0 &&
                <button className="delete-button" onClick={() => setSearchTerm('')}>
                    <img src={close} alt="Close"/>
                </button>
            }
            <button className="search-button" onClick={handleSearch}>
                <img src={search} alt="Search"/>
            </button>
        </div>
    )
}

export default SearchField