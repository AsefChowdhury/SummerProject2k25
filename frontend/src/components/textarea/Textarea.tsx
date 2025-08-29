import './Textarea.css'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: "outlined" | "underlined"
}

function Textarea({variant = "outlined", className, ...props}: TextareaProps) {
  return (
    <div className={`textarea-container ${variant}`}>
      <textarea {...props} className="textarea"/>
    </div>
  )
}

export default Textarea
