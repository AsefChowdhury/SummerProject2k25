import "./ProgressBar.css"

type ProgressBarProps = {
    value: number;
    max?: number;
    className?: string
    label?: string
}

function Progressbar(props: ProgressBarProps) {

    const getColor = (progress: number) => {
        if (progress < 40) {
            return "var(--error-color)";
        } else if (progress < 70) {
            return "var(--warning-color)";
        } else {
            return "var(--success-color)";
        }
    }

    return (
        <>
            {props.label && <p className="progress-bar-label">{props.label}</p>}
            <div className={`progress-bar-container ${props.className ?? ''}`}>
                <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${props.max ? (props.value / props.max) * 100 : props.value * 100}%`, backgroundColor: getColor(props.max ? (props.value / props.max) * 100 : props.value * 100) }}></div>
                </div>
            </div>
        </>
    );
}

export default Progressbar;