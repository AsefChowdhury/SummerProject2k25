import "./Card.css"

type CardProps = {
    children: React.ReactNode
}

function Card({children}: CardProps) {
    return(
        <div className="card-container">
            {children}
        </div>
    )
}

export default Card