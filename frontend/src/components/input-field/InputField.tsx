import './InputField.css'

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    children?: React.ReactNode
    variant?: "outlined" | "underlined"
    error?: string
    label?: {text: string, for?: string}
}

function InputField({children, ...props}: InputFieldProps) {
    return(
        <div>
            {props.label && <label className="input-field-label" htmlFor={props.label.for ?? ''}>{props.label.text}</label>}
            <div className="input-field-container">
                <div className={`input-contents ${props.className ?? ''} ${props.variant ?? 'outlined'} ${props.error ? 'error' : 'regular'}`}>
                    <input {...props} className="input-field"/>
                    {children}
                </div>
                {props.error && <p className="error-message">{props.error}</p>}
            </div>
        </div>
    )
}

export default InputField