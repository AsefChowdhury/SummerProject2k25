import { Link } from 'react-router-dom';
import './IconButton.css'

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: string;
    tooltip?: string;
    to?: string;
}

function IconButton(props: IconButtonProps) {
    const content = (
        <div className="icon-button-container">
            <button  {...props} className='button'>
                <img src={props.icon} className='icon-image'/>
            </button>
            {props.tooltip && <span className="tooltiptext">{props.tooltip}</span>}
        </div>
    )

    if(props.to){
        return(
            <div className="icon-button-container">
                <Link to={props.to}>
                    <button {...props} className='button'>
                        <img src={props.icon} className='icon-image'/>
                    </button>
                    {props.tooltip && <span className="tooltiptext">{props.tooltip}</span>}
                </Link>
            </div>
        )
    }
    return content
}

export default IconButton