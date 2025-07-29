import './InputField.css'

type InputFieldProps = {
    id?: string
    placeholder?: string
    maxLength?: number
    required?: boolean
    type?: string
    children?: React.ReactNode
}

function InputField(props: InputFieldProps) {
    return(
        <div className="input-field-container">
            <input id={props.id} type={props.type} placeholder={props.placeholder} className="input-field" maxLength={props.maxLength} required={props.required}/>
            {props.children}
        </div>
    )
}

export default InputField