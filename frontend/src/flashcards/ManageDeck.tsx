import Button from "../components/button/Button";
import "./flashcards-styles/ManageDeck.css";
import addIcon from "../assets/add.svg?react";
import copyIcon from "../assets/copy.svg?react";
import deleteIcon from "../assets/delete.svg?react";
import editIcon from "../assets/edit.svg?react";
import InputField from "../components/input-field/InputField";
import Card from "../components/card/Card";
import IconButton from "../components/IconButton/IconButton";
import { useState } from "react";

type ManageDeckProps = {
    mode: "edit" | "create";
}

function ManageDeck(props: ManageDeckProps) {
    
    class Flashcard {
        term: string;
        definition: string;
    
        constructor(term?: string, definition?: string) {
            this.term = term ?? "";
            this.definition = definition ?? "";
        }
    } 

    
    const [flashcards, setFlashcards] = useState([new Flashcard()]);

    type FlashcardComponentProps = {
        flashcard: Flashcard
        index: number
        onDelete: (index: number) => void
        onCopy: (index: number) => void
        disableDelete: boolean
    }

    function FlashcardComponent(props: FlashcardComponentProps) {
        return (
            <Card>
                <div className="card-content">
                    <InputField placeholder="Term" variant="underlined" defaultValue={props.flashcard.term} onChange={(e) => {props.flashcard.term = e.target.value}}/>
                    <InputField placeholder="Definition" variant="underlined" defaultValue={props.flashcard.definition} onChange={(e) => {props.flashcard.definition = e.target.value}}/>
                    <div className="card-actions">
                        <IconButton className="copy-button" icon={copyIcon} tooltip="Duplicate" onClick={() => {props.onCopy(props.index)}}/>
                        <IconButton className="delete-button" icon={deleteIcon} disabled={props.disableDelete} tooltip="Delete" onClick={() => {props.onDelete(props.index)}}/>
                    </div>
                </div>
            </Card> 
        )
    }

    const addFlashcard = () => {
        setFlashcards([...flashcards, new Flashcard()]);
    }

    const deleteFlashcard = (index: number) => {
        setFlashcards(flashcards.filter((_, i) => i !== index));
    }

    const copyFlashcard = (index: number) => {
        const newFlashcard = new Flashcard(flashcards[index].term, flashcards[index].definition);
        setFlashcards([...flashcards, newFlashcard]);
    }

    const createDeck = () => {
        console.log(flashcards);
    }

    return (
        <>
            <div className="page-header">
                <h1>{props.mode === "edit" ? "Edit deck" : "Create a new deck"}</h1>
                <div className="save-buttons">
                    <Button iconLeft={editIcon} text={props.mode === "edit" ? "Save" : "Create"} type="submit" variant="outlined" />
                    <Button text={props.mode === "edit" ? "Save and test" : "Create and test"} type="submit" variant="filled" />
                </div>
            </div>
            <div className="deck-info">
                <InputField placeholder="Title" />
            </div>
            <ol className="flashcard-list">
                {flashcards.map((flashcard, index) => (
                    <li key={index}>
                        <FlashcardComponent disableDelete={flashcards.length === 1} flashcard={flashcard} index={index} onDelete={deleteFlashcard} onCopy={copyFlashcard}/>
                    </li>
                ))}
            </ol>
            <div className="add-flashcard-button">
                <Button iconLeft={addIcon} variant="outlined" text="Add flashcard" onClick={addFlashcard}/>
            </div>
        </>
    )
}

export default ManageDeck