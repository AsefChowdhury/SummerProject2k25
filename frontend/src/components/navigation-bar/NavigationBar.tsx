import './NavigationBar.css';
import type { ReactNode } from 'react';

type NavigationBarProps = {
    children: ReactNode
}
function NavigationBar(props: NavigationBarProps) {
    return (
        <div className="navigation-bar">
            {props.children}
        </div>
    )
}

export default NavigationBar