import "./Spinner.css";
import SpinnerIcon from "../../assets/spinner.svg?react";

function Spinner() {
    return (
        <div className="spinner">
            <SpinnerIcon className="spinner-icon"/>
        </div>
    )
}

export default Spinner