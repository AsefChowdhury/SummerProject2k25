import Button from "../components/button/Button";
import "./flashcards-styles/ManageDeck.css";
import addIcon from "../assets/add.svg?react";
import copyIcon from "../assets/copy.svg?react";
import deleteIcon from "../assets/delete.svg?react";
import editIcon from "../assets/edit.svg?react";
import InputField from "../components/input-field/InputField";
import Card from "../components/card/Card";
import IconButton from "../components/icon-button/IconButton";
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Textarea from "../components/textarea/Textarea";
import Modal from "../components/modal/Modal";
import ModalSuccess from "../assets/modal-success.svg?react";

class Flashcard {
    static nextIndex = 0;
    term: string;
    definition: string;
    index?: number;
    id?: number;
    clientId: string;

    constructor(term?: string, definition?: string) {
        this.term = term ?? "";
        this.definition = definition ?? "";
        this.clientId = crypto.randomUUID()
    }
}

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
                <Textarea placeholder="Term" variant="underlined" defaultValue={props.flashcard.term} onChange={(e) => {props.flashcard.term = e.target.value}}/>
                <Textarea placeholder="Definition" variant="underlined" defaultValue={props.flashcard.definition} onChange={(e) => {props.flashcard.definition = e.target.value}}/>
                <div className="card-actions">
                    <IconButton className="copy-button" icon={copyIcon} tooltip="Duplicate" onClick={() => {props.onCopy(props.index)}}/>
                    <IconButton className="delete-button" icon={deleteIcon} disabled={props.disableDelete} tooltip="Delete" onClick={() => {props.onDelete(props.index)}}/>
                </div>
            </div>
        </Card> 
    )
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
    const [showFinishedModal, setShowFinishedModal] = useState(false);
    const [submittingDeck, setSubmittingDeck] = useState(false);
    let navigate = useNavigate();
    
    useEffect(() => {
        if(props.mode === "create"){
            setTitle("");
            setFlashcards([new Flashcard()]);
        }

        if(props.mode === "edit"){
            let isMounted = true;
            const fetchDeck = async () => {
                await api.get(`api/decks/${deckId}`).then(response => {
                    if(isMounted){
                        setTitle(response.data.title);
                        setFlashcards(response.data.flashcards);
                    }
                }).catch(error => console.log(error));
            }
            fetchDeck();
            return () => {
                isMounted = false;
            }
        }
    }, [props.mode, deckId]);

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
        if(submittingDeck){
            return;
        }

        for(let i = 0; i < flashcards.length; i++){
            flashcards[i].index = i;
        }

        if(props.mode == "edit"){
            setSubmittingDeck(true);
            await api
            .put(`api/decks/${deckId}/`, {
                id: deckId,
                title: title,
                flashcards: flashcards
            }).then(response => {
                if(response.status === 200){
                    setShowFinishedModal(true);
                }
            })
            .catch(error => console.log(error))
            .finally(() => {
                setSubmittingDeck(false);
            })
            return;
        }
        const deck = new Deck(title, flashcards);
        setSubmittingDeck(true);
        await api
        .post('api/decks/', deck)
        .then(response => {
            if(response.status === 201){
                navigate(`/flashcards/edit/${response.data.id}`);
                setShowFinishedModal(true);
            }
        })
        .catch(error => console.log(error))
        .finally(() => {
            
            setSubmittingDeck(false);
        })
    }

    return (
        <>
            <div className="page-header">
                <h1>{props.mode === "edit" ? "Edit deck" : "Create a new deck"}</h1>
                <div className="save-buttons">
                    <Button iconLeft={editIcon} text={props.mode === "edit" ? "Save" : "Create"} type="button" variant="outlined" onClick={() => {submitDeck()}}/>
                    <Button text={props.mode === "edit" ? "Save and test" : "Create and test"} type="button" variant="filled" />
                </div>
            </div>
            <div className="deck-info">
                <InputField placeholder="Title" value={title} onChange={(e) => {setTitle(e.target.value)}}/>
            </div>
            <ol className="flashcard-list">
                {flashcards.map((flashcard, index) => (
                    <li key={flashcard.id ?? flashcard.clientId}>
                        <FlashcardComponent disableDelete={flashcards.length === 1} flashcard={flashcard} index={index} onDelete={deleteFlashcard} onCopy={copyFlashcard}/>
                    </li>
                ))}
            </ol>
            <div className="add-flashcard-button">
                <Button iconLeft={addIcon} variant="outlined" text="Add flashcard" onClick={addFlashcard}/>
            </div>
            <Modal open={showFinishedModal}>
                <div className="finished-modal">
                    <h1>Your deck is ready!</h1>
                    <ModalSuccess/>
                    <div className="modal-actions">
                        <Button text="Continue editing" variant="filled" onClick={() => {setShowFinishedModal(false)}}/>
                        <Button text="View all decks" variant="outlined" onClick={() => {setShowFinishedModal(false); navigate(`/flashcards/`)}}/>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ManageDeck