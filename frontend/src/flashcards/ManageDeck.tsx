import Button from "../components/Button/Button";
import "./flashcards-styles/ManageDeck.css";
import add from "../assets/add.svg"
import InputField from "../components/input-field/InputField";
import Card from "../components/card/Card";
type ManageDeckProps = {
    mode: "edit" | "create";
}

function ManageDeck(props: ManageDeckProps) {
    return (
        <>
            <div className="page-header">
                <h1>{props.mode === "edit" ? "Edit deck" : "Create a new deck"}</h1>
                <div className="save-buttons">
                    <Button iconLeft={add} text={props.mode === "edit" ? "Save" : "Create"} type="submit" style="outlined" />
                    <Button text={props.mode === "edit" ? "Save and test" : "Create and test"} type="submit" style="filled" />
                </div>
            </div>
            <div className="deck-info">
                <InputField placeholder="Title" />
            </div>
            <Card children={<div className="card-content">Card content</div>} />
        </>
    )
}

export default ManageDeck