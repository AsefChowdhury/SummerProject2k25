import "./feature-card-styles/FeatureCard.css"

type FeatureCardProps = {
    image: string;
    description?: string; 
};

function FeatureCard(props: FeatureCardProps) {
    return(
        <div className="feature-card">
            <img src={props.image}/>
            <p>{props.description}</p>
        </div>
    )
}

export default FeatureCard;