import './InputField.css'

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    children?: React.ReactNode
    variant?: "outlined" | "underlined"
}

function InputField({children, ...props}: InputFieldProps) {
    return(
        <div className={`input-field-container ${props.className ?? ''} ${props.variant ?? 'outlined'}`}>
            <input {...props} className="input-field"/>
            {children}
        </div>
    )
}

export default InputField