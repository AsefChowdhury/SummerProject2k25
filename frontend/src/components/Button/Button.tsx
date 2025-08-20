import './Button.css';

type ButtonProps = {
    text: string;
    type?: "button" | "submit" | "reset" | undefined;
    variant?: "outlined" | "filled";
    iconLeft?: string;
    iconRight?: string;
    onClick?: () => void;
};

function Button(props: ButtonProps) {
    return(
        <div className={`button-container ${props.variant ?? 'filled'}`} onClick={props.onClick}>
            {props.iconLeft && <img className='icon' src={props.iconLeft} alt={props.text}/>}
            <button type={props.type ? props.type : 'button'} className="button">{props.text}</button>
            {props.iconRight && <img className='icon' src={props.iconRight} alt={props.text}/>}
        </div>
    )
}

export default Button;