import Card from "../components/card/Card"
import IconButton from "../components/IconButton/IconButton"
import editIcon from "../assets/edit.svg?react"
import deleteIcon from "../assets/delete.svg?react"
import { useEffect, useState } from "react"
import api from "../api"
import "./flashcards-styles/MyFlashcards.css"

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
                    <IconButton icon={editIcon} to={`/flashcards/edit/${props.id}`} tooltip="Edit deck"/>
                    <IconButton icon={deleteIcon} onClick={() => {props.onDelete(props.id)}} tooltip="Delete deck"/>
                </div>
            </div>
        </Card>
    )
}

function MyFlashcards() {
    const [decks, setDecks] = useState([]);

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
                        <DeckElement onDelete={handleDelete} key={deck.id} title={deck.title} id={deck.id} />
                    </li>
                ))}
            </ul>
        </>
    )
}

export default MyFlashcards