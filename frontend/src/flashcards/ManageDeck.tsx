import Button from "../components/button/Button";
import "./flashcards-styles/ManageDeck.css";
import addIcon from "../assets/add.svg?react";
import copyIcon from "../assets/copy.svg?react";
import deleteIcon from "../assets/delete.svg?react";
import editIcon from "../assets/edit.svg?react";
import InputField from "../components/input-field/InputField";
import Card from "../components/card/Card";
import IconButton from "../components/IconButton/IconButton";
import { useEffect, useRef, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Textarea from "../components/textarea/Textarea";
import Modal from "../components/modal/Modal";
import ModalSuccess from "../assets/modal-success.svg?react";
import dragIcon from "../assets/drag.svg?react";
import { useToast } from "../components/toast/toast";

class Flashcard {
    static nextIndex = 0;
    term: string;
    definition: string;
    termError?: string;
    definitionError?: string;
    index?: number;
    id?: number;
    clientId: string;

    constructor(term?: string, definition?: string, index?: number) {
        this.term = term ?? "";
        this.definition = definition ?? "";
        this.clientId = crypto.randomUUID()
        this.index = index;
    }
}

type FlashcardComponentProps = {
    flashcard: Flashcard
    index: number
    onDelete: (index: number) => void
    onCopy: (index: number) => void
    disableDelete: boolean
    onDragStart: (cardId: string, flashcard: Flashcard, mouseY: number) => void
    onDragEnd: () => void
    onDragging: (mouseY: number) => void
}
function FlashcardComponent(props: FlashcardComponentProps) {
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        if (dragging) {
            window.addEventListener("mousemove", handleDragging);
            window.addEventListener("mouseup", handleDragEnd);
            return () => {
                window.removeEventListener("mousemove", handleDragging);
                window.removeEventListener("mouseup", handleDragEnd);
            };
        }
    }, [dragging]);

    const handleDragging = (e: MouseEvent) => {
        props.onDragging(e.clientY);
    }

    const handleDragEnd = () => {
        setDragging(false);
        props.onDragEnd();
    }

    const handleDragStart = (e: React.MouseEvent) => {
        setDragging(true);
        props.onDragStart(props.flashcard.id ? props.flashcard.id.toString() : props.flashcard.clientId, props.flashcard, e.clientY);
    }

    return (
        <Card id={props.flashcard.id ? props.flashcard.id.toString() : props.flashcard.clientId} className={`flashcard${dragging ? ' dragging' : ''}`}>
            <div className="card-top">
                <div className="index">{props.flashcard.index !== undefined ? props.flashcard.index + 1 : ""}</div>
                <div className="card-actions">
                    <IconButton className="copy-button" icon={copyIcon} tooltip="Duplicate" onClick={() => {props.onCopy(props.index)}}/>
                    <IconButton className="delete-button" icon={deleteIcon} disabled={props.disableDelete} tooltip="Delete" onClick={() => {props.onDelete(props.index)}}/>
                    <IconButton className="drag-button" icon={dragIcon} tooltip="Drag to reorder" onMouseDown={(e) => {handleDragStart(e)}}/>
                </div>
            </div>
            <div className="card-bottom">
                <Textarea placeholder="Term" error={props.flashcard.termError} variant="underlined" defaultValue={props.flashcard.term} onChange={(e) => {props.flashcard.term = e.target.value}}/>
                <Textarea placeholder="Definition" error={props.flashcard.definitionError} variant="underlined" defaultValue={props.flashcard.definition} onChange={(e) => {props.flashcard.definition = e.target.value}}/>
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
    const [flashcards, setFlashcards] = useState([new Flashcard(undefined, undefined, 0)]);
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState<string | undefined>(undefined);
    const [showFinishedModal, setShowFinishedModal] = useState(false);
    const [submittingDeck, setSubmittingDeck] = useState(false);
    const [loading, setLoading] = useState(false);
    const [draggingCard, setDraggingCard] = useState<{ref: HTMLElement, rect: DOMRect, flashcard: Flashcard, startY: number} | null>(null);
    const flashcardRects = useRef<{ref: HTMLElement, rect: DOMRect, offsetPosition: number}[]>([]);
    const reorderedList = useRef<Flashcard[]>([]);
    const toast = useToast();
    const prevDragPosition = useRef<number>(0);
    let navigate = useNavigate();
    
    useEffect(() => {
        if(props.mode === "create"){
            setTitle("");
            setFlashcards([new Flashcard(undefined, undefined, 0)]);
        }

        if(props.mode === "edit"){
            setTitleError(undefined);
            setLoading(true);
            let isMounted = true;
            const fetchDeck = async () => {
                await api.get(`api/decks/${deckId}`).then(response => {
                    if(isMounted){
                        setTitle(response.data.title);
                        const flashcards = response.data.flashcards.map((flashcard: Flashcard, index: number) => ({...flashcard, index: index + 1}));
                        setFlashcards(flashcards);
                    }
                }).catch(error => {
                    toast?.addToast({message: "Something went wrong whilst fetching your deck, please try again", type: "error"});
                }).finally(() => {
                    setLoading(false);
                });
            }
            fetchDeck();
            return () => {
                isMounted = false;
            }
        }
    }, [props.mode, deckId]);

    const addFlashcard = () => {
        const newList = [...flashcards, new Flashcard()].map((flashcard, index) => ({...flashcard, index: index}));
        setFlashcards(newList);
    }

    const deleteFlashcard = (index: number) => {
        const newList = flashcards.filter((_, i) => i !== index).map((flashcard, index) => ({...flashcard, index: index}));
        setFlashcards(newList);
    }

    const copyFlashcard = (index: number) => {
        const newFlashcard = new Flashcard(flashcards[index].term, flashcards[index].definition);
        const newList = [...flashcards, newFlashcard].map((flashcard, index) => ({...flashcard, index: index}));
        setFlashcards(newList);
    }

    const validateDeck = () => {
        let isValid = true;
        if(title === ""){
            setTitleError("Title cannot be empty");
            isValid = false;
        } else if(title.length > 100){
            setTitleError("Title must be less than or equal to 100 characters");
            isValid = false;
        } else {
            setTitleError(undefined);
        }
        const validateFlashcards = flashcards.map(flashcard => {
            if(flashcard.term === ""){
                flashcard.termError = "Term cannot be empty";
                isValid = false;
            }
            else if(flashcard.term.length > 100){
                flashcard.termError = "Term must be less than or equal to 100 characters";
                isValid = false;
            } else {
                flashcard.termError = undefined;
            }
            if(flashcard.definition === ""){
                flashcard.definitionError = "Definition cannot be empty";
                isValid = false;
            }
            else if(flashcard.definition.length > 1000){
                flashcard.definitionError = "Definition must be less than or equal to 1000 characters";
                isValid = false;
            } else {
                flashcard.definitionError = undefined;
            }
            return flashcard;
        });
        setFlashcards(validateFlashcards)
        return isValid;
    }

    const submitDeck = async () => {
        if(submittingDeck){
            return;
        }
        if(!validateDeck()){
            return;
        }
        for(let i = 0; i < flashcards.length; i++){
            flashcards[i].index = i;
        }
        try{
            setSubmittingDeck(true);
            setLoading(true);
            let response;
            if (props.mode == "edit"){
                response = await api.put(`api/decks/${deckId}/`, {
                    id: deckId,
                    title: title,
                    flashcards: flashcards
                })
            } else if (props.mode == "create"){
                const deck = new Deck(title, flashcards);
                response = await api.post('api/decks/', deck)
            }
            if(response?.status === 200 || response?.status === 201){
                if(props.mode === "create"){
                    navigate(`/flashcards/edit/${response.data.id}`);
                }
                setShowFinishedModal(true);
            }
        } catch (error) {
            toast?.addToast({message: `Something went wrong whilst ${props.mode === "edit" ? "saving" : "creating"} your deck, please try again`, type: "error"});
        } finally {
            setSubmittingDeck(false);
            setLoading(false);
        }
    }

    const handleDragStart = (cardId: string, flashcard: Flashcard,  mouseY: number) => {
        prevDragPosition.current = mouseY;
        const cards = [...document.getElementsByClassName("flashcard")];
        const cardRects = cards.map(card => ({ref: card as HTMLElement, rect: card.getBoundingClientRect(), offsetPosition: 0}));
        flashcardRects.current = cardRects;
        reorderedList.current = flashcards;
        const card = document.getElementById(cardId);
        if(!card) return;
        setDraggingCard({ref: card, rect: card.getBoundingClientRect(), flashcard: flashcard, startY: mouseY});
    }

    const handleDragEnd = () => {
        if(!draggingCard) return;
        const newList = reorderedList.current.map((flashcard, index) => ({...flashcard, index: index}));
        setFlashcards(newList);
        document.querySelectorAll('.flashcard:not(.dragging)').forEach(el => {
            (el as HTMLElement).style.transition = 'none';
            (el as HTMLElement).style.transform = 'translateY(0px)';
        });
        draggingCard.ref.style.transform = `translateY(0px)`;
        setDraggingCard(null);
    }

    const handleDragging = (mouseY: number) => {
        if(!draggingCard) return;
        let dy = mouseY - draggingCard.startY;
        let velocity = mouseY - prevDragPosition.current;
        const cardIndex = reorderedList.current.findIndex(flashcard => flashcard.clientId === draggingCard.flashcard.clientId);

        const nextCardRect = flashcardRects.current[cardIndex + 1];
        const prevCardRect = flashcardRects.current[cardIndex - 1];
        draggingCard.ref.style.transform = `translateY(${dy}px)`;
        if(velocity > 0){
            if (nextCardRect === undefined) return;
            if (mouseY >= nextCardRect.rect.top - (draggingCard.rect.height / 2)) {
                nextCardRect.ref.style.transition = 'transform 0.2s ease';
                const newPosition = nextCardRect.offsetPosition + (draggingCard.rect.height * -1 - 20)
                nextCardRect.ref.style.transform = `translateY(${newPosition}px)`;
                const newFlashcards = [...reorderedList.current];
                const nextFlashcard = newFlashcards[cardIndex + 1];
                newFlashcards[cardIndex] = nextFlashcard;
                newFlashcards[cardIndex + 1] = draggingCard.flashcard;
                
                const newRects = [...flashcardRects.current];
                newRects[cardIndex] = {ref: nextCardRect.ref, rect: {...nextCardRect.rect, top: nextCardRect.rect.top - (draggingCard.rect.height + 20)}, offsetPosition: newPosition};
                newRects[cardIndex + 1] = {ref: draggingCard.ref, rect: draggingCard.ref.getBoundingClientRect(), offsetPosition: 0};
                flashcardRects.current = newRects;
                
                reorderedList.current = newFlashcards;
                prevDragPosition.current = mouseY;
            }
            
        } else if (velocity <= 0) {
            if (prevCardRect === undefined) return;
            if(mouseY <= prevCardRect.rect.top + (draggingCard.rect.height / 2)){
                prevCardRect.ref.style.transition = 'transform 0.2s ease';
                const newPosition = prevCardRect.offsetPosition + (draggingCard.rect.height + 20)
                prevCardRect.ref.style.transform = `translateY(${newPosition}px)`;
                const newFlashcards = [...reorderedList.current];
                const prevFlashcard = newFlashcards[cardIndex - 1];
                newFlashcards[cardIndex] = prevFlashcard;
                newFlashcards[cardIndex - 1] = draggingCard.flashcard;
    
                const newRects = [...flashcardRects.current];
                newRects[cardIndex] = {ref: prevCardRect.ref, rect: {...prevCardRect.rect, top: prevCardRect.rect.top + (draggingCard.rect.height + 20)}, offsetPosition: newPosition};
                newRects[cardIndex - 1] = {ref: draggingCard.ref, rect: draggingCard.ref.getBoundingClientRect(), offsetPosition: 0};
                flashcardRects.current = newRects;
                reorderedList.current = newFlashcards;
                prevDragPosition.current = mouseY;
            }
        }  
    }

    return (
        <>
            <div className="page-header">
                <h1>{props.mode === "edit" ? "Edit deck" : "Create a new deck"}</h1>
                <div className="save-buttons">
                    <Button loading={loading} iconLeft={editIcon} text={props.mode === "edit" ? "Save" : "Create"} type="button" variant="outlined" onClick={() => {submitDeck()}}/>
                    <Button loading={loading} text={props.mode === "edit" ? "Save and test" : "Create and test"} type="button" variant="filled" />
                </div>
            </div>
            <div className="deck-info">
                <InputField error={titleError} placeholder="Title" value={title} onChange={(e) => {setTitle(e.target.value)}}/>
            </div>
            <ol className="flashcard-list">
                {flashcards.map((flashcard, index) => (
                    <li key={flashcard.id ?? flashcard.clientId}>
                        <FlashcardComponent 
                            disableDelete={flashcards.length === 1}
                            flashcard={flashcard} index={index}
                            onDelete={deleteFlashcard}
                            onCopy={copyFlashcard}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDragging={handleDragging}
                        />
                    </li>
                ))}
            </ol>
            <div className="flashcards-bottom">
                <Button disabled={loading} id="add-flashcard-button" iconLeft={addIcon} variant="outlined" text="Add flashcard" onClick={addFlashcard}/>
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