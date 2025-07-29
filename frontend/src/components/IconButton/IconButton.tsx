import './IconButton.css'

type IconButtonProps = {
    icon: string;
    type?: "button" | "submit" | "reset" | undefined;
    tooltip?: string;
    onClick?: () => void;
}

function IconButton(props: IconButtonProps) {
    return(
        <div className="icon-button-container">
            <button type={props.type ? props.type : 'button'} className='button' onClick={props.onClick}>
                <img src={props.icon} className='icon-image'/>
            </button>
            {props.tooltip && <span className="tooltiptext">{props.tooltip}</span>}
        </div>
        
    )
}

export default IconButton