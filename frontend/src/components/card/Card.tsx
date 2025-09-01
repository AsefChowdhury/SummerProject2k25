import "./Card.css"

type CardProps = {
    children: React.ReactNode
    className?: string
}

function Card(props: CardProps) {
    return(
        <div className={`card-container ${props.className ?? ''}`}>
            {props.children}
        </div>
    )
}

export default Card