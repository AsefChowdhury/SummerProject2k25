import { Link } from 'react-router-dom';
import './IconButton.css'

type IconButtonProps = {
    icon: string;
    type?: "button" | "submit" | "reset" | undefined;
    tooltip?: string;
    to?: string;
    onClick?: () => void;
}

function IconButton(props: IconButtonProps) {
    const content = (
        <div className="icon-button-container">
            <button type={props.type ? props.type : 'button'} className='button' onClick={props.onClick}>
                <img src={props.icon} className='icon-image'/>
            </button>
            {props.tooltip && <span className="tooltiptext">{props.tooltip}</span>}
        </div>
    )

    if(props.to){
        return(
            <div className="icon-button-container">
                <Link to={props.to}>
                    <button type={props.type ? props.type : 'button'} className='button' onClick={props.onClick}>
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