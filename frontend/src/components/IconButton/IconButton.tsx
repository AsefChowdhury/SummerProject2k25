import { Link } from 'react-router-dom';
import './IconButton.css'

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    tooltip?: string;
    to?: string;
    className?: string;
}

function IconButton({icon: Icon, className, ...props}: IconButtonProps) {
    const content = (
        <button {...props} className={`icon-button ${className ?? ''}`} disabled={props.disabled}>
            <Icon className="icon-image" fill='currentColor'/>
            {props.tooltip && <span className="tooltiptext">{props.tooltip}</span>}
        </button>
    )

    if(props.to){
        return(
            <Link to={props.to}>
                <button {...props} className={`icon-button ${className ?? ''}`} disabled={props.disabled}>
                    <Icon className="icon-image" fill='currentColor'/>
                    {props.tooltip && <span className="tooltiptext">{props.tooltip}</span>}
                </button>
            </Link>
        )
    }
    return content
}

export default IconButton