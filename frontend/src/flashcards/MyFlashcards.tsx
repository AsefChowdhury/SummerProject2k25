import Card from "../components/card/Card"
import IconButton from "../components/IconButton/IconButton"
import editIcon from "../assets/edit.svg?react"
import deleteIcon from "../assets/delete.svg?react"
import { useEffect, useState } from "react"
import api from "../api"
import "./flashcards-styles/MyFlashcards.css"
import Modal from "../components/modal/Modal"
import Button from "../components/button/Button"

type DeckElementProps = {
    title: string
    numOfCards?: number
    id: number
    onDelete: (id: number) => void
}

function DeckElement(props: DeckElementProps) {

    return (
        <Card>
            <div className="deck-component">
                <h2>{props.title}</h2>
                <div className="deck-actions">
                    <Button text="Test" variant="outlined" to={`/flashcards/test/${props.id}`}/>
                    <IconButton icon={editIcon} to={`/flashcards/edit/${props.id}`} tooltip="Edit deck"/>
                    <IconButton icon={deleteIcon} onClick={() => {props.onDelete(props.id)}} tooltip="Delete deck"/>
                </div>
            </div>
        </Card>
    )
}

function MyFlashcards() {
    const [decks, setDecks] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deckToDelete, setDeckToDelete] = useState({id: 0, title: undefined});

    useEffect(() => {
        getDecks();
    }, []);

    const getDecks = async () => {
        await api
        .get('api/decks/')
        .then(response => {
            setDecks(response.data);
        })
        .catch(error => console.log(error));
    }

    const handleDelete = async (id: number) => {
        await api.delete(`api/decks/${id}/`).catch(error => console.log(error));
        getDecks();
    }

    return (
        <>
            <div className="page-header">
                <h1>My Flashcards</h1>
            </div>
            <ul className="decks-list">
                {decks.map((deck: any) => (
                    <li key={deck.id}>
                        <DeckElement onDelete={() => {setDeckToDelete({id: deck.id, title: deck.title}); setShowDeleteModal(true)}} key={deck.id} title={deck.title} id={deck.id} />
                    </li>
                ))}
            </ul>
            <Modal open={showDeleteModal}>
                <div className="delete-modal">
                    <h1>Are you sure?</h1>
                    <p>Are you sure you want to delete the deck "{deckToDelete.title}"?<br />This action cannot be undone.</p>
                    <div className="modal-actions">
                        <Button text="Cancel" variant="outlined" onClick={() => {setShowDeleteModal(false)}}/>
                        <Button text="Delete" variant="filled" onClick={() => {setShowDeleteModal(false); handleDelete(deckToDelete.id)}}/>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default MyFlashcards