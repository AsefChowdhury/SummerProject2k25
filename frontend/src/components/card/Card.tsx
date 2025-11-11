import type React from "react"
import "./Card.css"

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode
    className?: string
    ref?: React.Ref<HTMLDivElement>
}

function Card({children, className, ref, ...props}: CardProps) {
    return(
        <div className={`card-container ${className ?? ''}`} ref={ref} {...props}>
            {children}
        </div>
    )
}

export default Card