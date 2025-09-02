import "./Card.css"

type CardProps = {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
}

function Card(props: CardProps) {
    return(
        <div className={`card-container ${props.className ?? ''}`}>
            {props.children}
        </div>
    )
}

export default Card