import "./Card.css"

type CardProps = {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
    onClick ?: React.MouseEventHandler<HTMLElement>
}

function Card(props: CardProps) {
    return(
        <div className={`card-container ${props.className ?? ''}`} onClick={props.onClick}>
            {props.children}
        </div>
    )
}

export default Card