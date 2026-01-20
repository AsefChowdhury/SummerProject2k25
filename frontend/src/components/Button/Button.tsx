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

function Button({iconLeft: IconLeft, iconRight: IconRight, loading, ...props}: ButtonProps) {
    const content = (
        <button {...props} onClick={props.onClick} disabled={loading || props.disabled} className={`button ${props.className ?? ''} ${props.variant ?? 'filled'}`} >
            {IconLeft && <IconLeft className='icon-image'/>}
            <div className="button-content">
                {loading &&
                    <Spinner /> 
                }
                <span className={`button-text ${loading ? 'loading' : ''}`}>{props.text}</span>
            </div>
            {IconRight && <IconRight className='icon-image'/>}
        </button>
    )

    if (props.to) {
        return(
            <Link className="button-link" to={props.to} >
                <button {...props} onClick={props.onClick} disabled={loading || props.disabled} className={`button ${props.className ?? ''} ${props.variant ?? 'filled'}`} >
                    {IconLeft && <IconLeft className='icon-image'/>}
                    <div className="button-content">
                        {loading &&
                            <Spinner /> 
                        }
                        <span className={`button-text ${loading ? 'loading' : ''}`}>{props.text}</span>
                    </div>
                    {IconRight && <IconRight className='icon-image'/>}
                </button>
            </Link>
        )
    }
    return content
}

export default Button;