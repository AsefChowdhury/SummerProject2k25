import { Link } from 'react-router-dom';
import './Button.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &{
    text: string;
    variant?: "outlined" | "filled";
    iconLeft?: React.FC<React.SVGProps<SVGSVGElement>>;
    iconRight?: React.FC<React.SVGProps<SVGSVGElement>>;
    to?: string;
    onClick?: () => void;
};

function Button({...props}: ButtonProps) {
    const content = (
        <div className="button-container" onClick={props.onClick}>
            <button className={`button ${props.variant ?? 'filled'}`} {...props}>
                {props.iconLeft && <props.iconLeft className='icon'/>}
                {props.text}
                {props.iconRight && <props.iconRight className='icon'/>}
            </button>
        </div>
    )

    if (props.to) {
        return(
            <div className="button-container" onClick={props.onClick}>
                <Link to={props.to} >
                    <button className={`button ${props.variant ?? 'filled'}`} {...props}>
                        {props.iconLeft && <props.iconLeft className='icon'/>}
                        {props.text}
                        {props.iconRight && <props.iconRight className='icon'/>}
                    </button>
                </Link>
            </div>
        )
    }
    return content
}

export default Button;