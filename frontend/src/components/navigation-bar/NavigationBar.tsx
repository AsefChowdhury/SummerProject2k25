import './NavigationBar.css';
import { useEffect, useState, type ReactNode } from 'react';

type NavigationBarProps = {
    children: ReactNode
    type?: "fixed" | "scrollable"
}
function NavigationBar(props: NavigationBarProps) {
    const [scrolled, setScrolled] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 0;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <div className={`navigation-bar ${scrolled ? 'scrolled' : ''}`}>
            {props.children}
        </div>
    )
}

export default NavigationBar