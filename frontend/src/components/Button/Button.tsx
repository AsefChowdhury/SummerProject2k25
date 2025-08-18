import './Button.css';

type ButtonProps = {
    text: string;
    type?: "button" | "submit" | "reset" | undefined;
    style?: "outlined" | "filled";
    iconLeft?: string;
    iconRight?: string;
    onClick?: () => void;
};

function Button(props: ButtonProps) {
    return(
        <div className={`button-container ${props.style ?? 'filled'}`}>
            {props.iconLeft && <img className='icon' src={props.iconLeft} alt={props.text}/>}
            <button type={props.type ? props.type : 'button'} className="button" onClick={props.onClick}>{props.text}</button>
            {props.iconRight && <img className='icon' src={props.iconRight} alt={props.text}/>}
        </div>
    )
}

export default Button;