import { Link } from 'react-router-dom';
import './Button.css';
import Spinner from '../spinner/Spinner';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &{
    text: string;
    variant?: "outlined" | "filled";
    iconLeft?: React.FC<React.SVGProps<SVGSVGElement>>;
    iconRight?: React.FC<React.SVGProps<SVGSVGElement>>;
    to?: string;
    loading?: boolean;
    onClick?: () => void;
};

function Button({iconLeft: IconLeft, iconRight: IconRight, ...props}: ButtonProps) {
    const content = (
        <div className="button-container" onClick={props.onClick}>
            <button {...props} disabled={props.loading || props.disabled} className={`button ${props.variant ?? 'filled'}`} >
                {IconLeft && <IconLeft className='icon-image'/>}
                <div className="button-content">
                    {props.loading &&
                            <Spinner /> 
                    }
                    <span className={`button-text ${props.loading ? 'loading' : ''}`}>{props.text}</span>
                </div>
                {IconRight && <IconRight className='icon-image'/>}
            </button>
        </div>
    )

    if (props.to) {
        return(
            <div className="button-container" onClick={props.onClick}>
                <Link to={props.to} >
                    <button {...props} disabled={props.loading || props.disabled} className={`button ${props.variant ?? 'filled'}`} >
                        {IconLeft && <IconLeft className='icon-image'/>}
                        <div className="button-content">
                            {props.loading &&
                                    <Spinner /> 
                            }
                            <span className={`button-text ${props.loading ? 'loading' : ''}`}>{props.text}</span>
                        </div>
                        {IconRight && <IconRight className='icon-image'/>}
                    </button>
                </Link>
            </div>
        )
    }
    return content
}

export default Button;