import './InputField.css'

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    children?: React.ReactNode
    variant?: "outlined" | "underlined"
    error?: string
}

function InputField({children, ...props}: InputFieldProps) {
    return(
        <div className="input-field-container">
            <div className={`input-contents ${props.className ?? ''} ${props.variant ?? 'outlined'} ${props.error ? 'error' : 'regular'}`}>
                <input {...props} className="input-field"/>
                {children}
            </div>
            {props.error && <p className="error-message">{props.error}</p>}
        </div>
    )
}

export default InputField