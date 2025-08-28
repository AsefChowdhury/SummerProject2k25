import './Textarea.css'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    children?: React.ReactNode
    variant?: "outlined" | "underlined"
}

function Textarea({children, ...props}: TextareaProps) {
    return(
        <div className={`textarea-container ${props.className ?? ''} ${props.variant ?? 'outlined'}`}>
            <textarea {...props} className="textarea"/>
            {children}
        </div>
    )
}

export default Textarea