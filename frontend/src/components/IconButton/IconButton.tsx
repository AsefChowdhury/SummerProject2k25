import './IconButton.css'

type IconButtonProps = {
    icon: string;
    onClick?: () => void;
}

function IconButton(props: IconButtonProps) {
    return(
        <button className='button-container' onClick={props.onClick}>
            <img src={props.icon}  className='icon-image'/>
        </button>
    )
}

export default IconButton