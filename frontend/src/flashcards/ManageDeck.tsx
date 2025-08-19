import Button from "../components/button/Button";
import "./flashcards-styles/ManageDeck.css";
import add from "../assets/add.svg";
import copy from "../assets/copy.svg";
import deleteIcon from "../assets/delete.svg";
import InputField from "../components/input-field/InputField";
import Card from "../components/card/Card";
import IconButton from "../components/IconButton/IconButton";

type ManageDeckProps = {
    mode: "edit" | "create";
}

function ManageDeck(props: ManageDeckProps) {

    function Flashcard() {
        return (
            <Card>
                <div className="card-content">
                    <InputField placeholder="Term" variant="underlined" />
                    <InputField placeholder="Definition" variant="underlined" />
                    <div className="card-actions">
                        <IconButton icon={copy} />
                        <IconButton icon={deleteIcon} />
                    </div>
                </div>
            </Card> 
        )
    }
    return (
        <>
            <div className="page-header">
                <h1>{props.mode === "edit" ? "Edit deck" : "Create a new deck"}</h1>
                <div className="save-buttons">
                    <Button iconLeft={add} text={props.mode === "edit" ? "Save" : "Create"} type="submit" variant="outlined" />
                    <Button text={props.mode === "edit" ? "Save and test" : "Create and test"} type="submit" variant="filled" />
                </div>
            </div>
            <div className="deck-info">
                <InputField placeholder="Title" />
            </div>
            <ol className="flashcard-list"><Flashcard /></ol>
            <div className="add-flashcard-button">
                <Button iconLeft={add} variant="outlined" text="Add flashcard"/>
            </div>
        </>
    )
}

export default ManageDeck