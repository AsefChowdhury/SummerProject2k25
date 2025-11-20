import type React from "react"
import "./Card.css"

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode
    className?: string
}

function Card({children, className, ...props}: CardProps) {
    return(
        <div className={`card-container ${className ?? ''}`} {...props}>
            {children}
        </div>
    )
}

export default Card