import Button from "../components/button/Button";
import "./flashcards-styles/ManageDeck.css";
import addIcon from "../assets/add.svg?react";
import copyIcon from "../assets/copy.svg?react";
import deleteIcon from "../assets/delete.svg?react";
import editIcon from "../assets/edit.svg?react";
import InputField from "../components/input-field/InputField";
import Card from "../components/card/Card";
import IconButton from "../components/IconButton/IconButton";
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Textarea from "../components/textarea/Textarea";

class Flashcard {
    static nextIndex = 0;
    term: string;
    definition: string;
    index?: number;
    id?: number;

    constructor(term?: string, definition?: string) {
        this.term = term ?? "";
        this.definition = definition ?? "";
    }
}

class Deck{
    title: string;
    flashcards: Flashcard[];
    
    constructor(title: string, flashcards: Flashcard[]) {
        this.title = title;
        this.flashcards = flashcards;
    }
}

type ManageDeckProps = {
    mode: "edit" | "create";
}

function ManageDeck(props: ManageDeckProps) {
    
    
    const {deckId} = useParams();
    const [flashcards, setFlashcards] = useState([new Flashcard()]);
    const [title, setTitle] = useState("");
    let navigate = useNavigate();

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
                    <Textarea className="term" placeholder="Term" variant="underlined" defaultValue={props.flashcard.term} onChange={(e) => {props.flashcard.term = e.target.value}}/>
                    <Textarea className="definition" placeholder="Definition" variant="underlined" defaultValue={props.flashcard.definition} onChange={(e) => {props.flashcard.definition = e.target.value}}/>
                    <div className="card-actions">
                        <IconButton className="copy-button" icon={copyIcon} tooltip="Duplicate" onClick={() => {props.onCopy(props.index)}}/>
                        <IconButton className="delete-button" icon={deleteIcon} disabled={props.disableDelete} tooltip="Delete" onClick={() => {props.onDelete(props.index)}}/>
                    </div>
                </div>
            </Card> 
        )
    }

    useEffect(() => {
        setTitle("");
        setFlashcards([new Flashcard()]);
        if(props.mode === "edit"){
            getDeck();
        }
    }, [props.mode]);

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

    const submitDeck = async () => {
        for(let i = 0; i < flashcards.length; i++){
            flashcards[i].index = i;
        }
        console.log("submitting deck...");
        console.log(flashcards)
        if(props.mode == "edit"){
            await api
            .put(`api/decks/${deckId}/`, {
                title: title,
                flashcards: flashcards
            })
            .catch(error => console.log(error));
            return;
        }
        const deck = new Deck(title, flashcards);
        await api
        .post('api/decks/', deck)
        .then(response => {
            if(response.status === 201){
                navigate(`/flashcards/edit/${response.data.id}`);
            }
        })
        .catch(error => console.log(error));
    }

    const getDeck = async () => {
        await api.get(`api/decks/${deckId}`).then(response => {
            setTitle(response.data.title);
            setFlashcards(response.data.flashcards);
            console.log("grabbing deck...");
            console.log(response.data.flashcards);
        }).catch(error => console.log(error));
    }

    return (
        <>
            <div className="page-header">
                <h1>{props.mode === "edit" ? "Edit deck" : "Create a new deck"}</h1>
                <div className="save-buttons">
                    <Button iconLeft={editIcon} text={props.mode === "edit" ? "Save" : "Create"} type="submit" variant="outlined" onClick={submitDeck}/>
                    <Button text={props.mode === "edit" ? "Save and test" : "Create and test"} type="submit" variant="filled" />
                </div>
            </div>
            <div className="deck-info">
                <InputField placeholder="Title" defaultValue={title} onChange={(e) => {setTitle(e.target.value)}}/>
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