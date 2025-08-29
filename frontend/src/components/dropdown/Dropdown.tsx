import { useEffect, useRef } from 'react';
import './dropdown-styles/Dropdown.css'

type DropdownProps = {
    anchor: HTMLElement
    children: React.ReactNode;
    open: boolean
    onClose: () => void
};

function Dropdown(props: DropdownProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if(!props.open) return;
        const handleClickOutside = (event: MouseEvent) => {

            const eventTarget = event.target as Node;

            if (props.anchor.contains(eventTarget)) {
                return;
            }

            if (containerRef.current && !containerRef.current.contains(eventTarget)) {
                props.onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', props.onClose);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', props.onClose);
        };
        
    }, [props.open]);
    
    return (
        <>
            {props.open &&
                <div className='dropdown-container' ref={containerRef}>
                    {props.children}
                </div>
            }
        </>
    )
}

export default Dropdown