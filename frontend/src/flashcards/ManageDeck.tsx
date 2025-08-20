import Button from "../components/button/Button";
import "./flashcards-styles/ManageDeck.css";
import add from "../assets/add.svg";
import copy from "../assets/copy.svg";
import deleteIcon from "../assets/delete.svg";
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
    
        constructor(term: string, definition: string) {
            this.term = term;
            this.definition = definition;
        }
    } 

    
    const [flashcards, setFlashcards] = useState([new Flashcard("", "")]);

    type FlashcardComponentProps = {
        flashcard: Flashcard
        index: number
        onDelete: (index: number) => void
        onCopy: (index: number) => void
    }

    function FlashcardComponent(props: FlashcardComponentProps) {
        // const [term, setTerm] = useState(props.flashcard.term);
        // const [definition, setDefinition] = useState(props.flashcard.definition);

        const handleTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            // setTerm(event.target.value);
            console.log(event.target.value)
            props.flashcard.term = event.target.value;
        }

        const handleDefinitionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            // setDefinition(event.target.value);
            console.log(event.target.value)
            props.flashcard.definition = event.target.value;
        }

        return (
            <Card>
                <div className="card-content">
                    <InputField placeholder="Term" variant="underlined" defaultValue={props.flashcard.term} onChange={handleTermChange}/>
                    <InputField placeholder="Definition" variant="underlined" defaultValue={props.flashcard.definition} onChange={handleDefinitionChange}/>
                    <div className="card-actions">
                        <IconButton icon={copy} onClick={() => {props.onCopy(props.index)}}/>
                        <IconButton icon={deleteIcon} onClick={() => {props.onDelete(props.index)}}/>
                    </div>
                </div>
            </Card> 
        )
    }

    const addFlashcard = () => {
        setFlashcards([...flashcards, new Flashcard("", "")]);
    }

    const deleteFlashcard = (index: number) => {
        setFlashcards(flashcards.filter((_, i) => i !== index));
    }

    const copyFlashcard = (index: number) => {
        const newFlashcard = new Flashcard(flashcards[index].term, flashcards[index].definition);
        setFlashcards([...flashcards, newFlashcard]);
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
            <ol className="flashcard-list">
                {flashcards.map((flashcard, index) => (
                    <li key={index}>
                        <FlashcardComponent flashcard={flashcard} index={index} onDelete={deleteFlashcard} onCopy={copyFlashcard}/>
                    </li>
                ))}
            </ol>
            <div className="add-flashcard-button">
                <Button iconLeft={add} variant="outlined" text="Add flashcard" onClick={addFlashcard}/>
            </div>
        </>
    )
}

export default ManageDeck