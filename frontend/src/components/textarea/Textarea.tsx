import './Textarea.css'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: "outlined" | "underlined";
  error?: string;
}

function Textarea({variant = "outlined", className, ...props}: TextareaProps) {
  return (
    <div className="textarea-container">
      <textarea {...props} className={`textarea ${className ?? ''} ${variant} ${props.error ? 'error' : 'regular'}`}/>
      {props.error && <p className="error-message">{props.error}</p>}
    </div>
  )
}

export default Textarea
