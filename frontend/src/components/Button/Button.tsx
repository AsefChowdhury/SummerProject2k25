type ButtonProps = {
    text: string;
    type?: "button" | "submit" | "reset" | undefined;
    style?: "outlined" | "filled";
    onClick?: () => void;
};

function Button(props: ButtonProps) {
    return(
        <button type={props.type ? props.type : 'button'} className='button' onClick={props.onClick}>{props.text}</button>
    )
}

export default Button;