import { Link } from 'react-router-dom';
import './IconButton.css'

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    tooltip?: string;
    to?: string;
    className?: string;
    ref?: React.Ref<HTMLDivElement>;
}

function IconButton({icon: Icon, className, ref, ...props}: IconButtonProps) {
    const content = (
        <div ref={ref} className={`icon-button-container ${className ?? ''}`}>
            <button {...props} className="button" disabled={props.disabled}>
                <Icon className="icon-image" fill='currentColor'/>
                {props.tooltip && <span className="tooltiptext">{props.tooltip}</span>}
            </button>
        </div>
    )

    if(props.to){
        return(
            <div ref={ref} className="icon-button-container">
                <Link to={props.to}>
                    <button {...props} className='button'>
                        <Icon className="icon-image" fill='currentColor'/>
                        {props.tooltip && <span className="tooltiptext">{props.tooltip}</span>}
                    </button>
                </Link>
            </div>
        )
    }
    return content
}

export default IconButton