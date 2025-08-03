import './InputField.css'

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    children?: React.ReactNode
}

function InputField({children, ...props}: InputFieldProps) {
    return(
        <div className="input-field-container">
            <input {...props} className="input-field"/>
            {children}
        </div>
    )
}

export default InputField