import Card from "../components/card/Card";
import IconButton from "../components/IconButton/IconButton";
import close from '../assets/close.svg?react'
import tick from '../assets/tick.svg?react'
import flip from '../assets/flip.svg?react'
import { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import Button from "../components/button/Button";
import "./flashcards-styles/FlashcardTest.css"
import Progressbar from "../components/progress-bar/ProgressBar";
import Modal from "../components/modal/Modal";

class Flashcard{
    term: string;
    definition: string;
    constructor(term: string, definition: string){
        this.term = term;
        this.definition = definition;
    }
}

function FlashcardTest(){
    const {deckId} = useParams();
    const [flashcardQueue, setFlashcardQueue] = useState<Flashcard[] | null>(null);
    const [numOfCards, setNumOfCards] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    

    useEffect(() => {
        let isMounted = true;
        const fetchDeck = async () => {
            await api.get(`api/decks/${deckId}`).then(response => {
                if(isMounted){
                    setFlashcardQueue(response.data.flashcards);
                    setNumOfCards(response.data.flashcards.length);
                }
            }).catch(error => console.log(error));
        }
        fetchDeck();
        return () => {
            isMounted = false;
        }
    }, []);

    const handleNextCard = (state: "remembered" | "forgot") => {
        if(flashcardQueue === null){
            return;
        }
        setFlipped(false);
        const [card, ...rest] = flashcardQueue;
        if(state === "forgot"){
            setFlashcardQueue([...rest, card]);
        } else if(state === "remembered"){
            setFlashcardQueue(rest);
        }
        
        return;
    }

    const showCard = () => {
        if(flashcardQueue === null){
            return(
                <h1>Loading...</h1>
            )
        }
        const progress = numOfCards > 0 ? (numOfCards - flashcardQueue.length) / numOfCards : 0;
        return(
            <div className="flashcard-container">
                <Progressbar value={progress} className="test-progress-bar"/>
                <Card className={`card ${flipped ? 'flipped' : ''}`}>
                    {flashcardQueue.length > 0 &&
                        <>
                            <div className="front">
                                <div className="flashcard-content">
                                    <h1>Term</h1>
                                    <p className="flashcard-term">{flashcardQueue[0].term}</p>
                                    <IconButton className="flip-button" icon={flip} tooltip="Flip card" onClick={() => {setFlipped(!flipped)}}/>
                                </div>
                            </div>
                            <div className="back">
                                <div className="flashcard-content">
                                    <h1>Definition</h1>
                                    <p className="flashcard-definition">{flashcardQueue[0].definition}</p>
                                    <IconButton className="flip-button" icon={flip} tooltip="Flip card" onClick={() => {setFlipped(!flipped)}}/>
                                </div>
                            </div>
                        </>
                    }
                    {flashcardQueue.length === 0 &&
                        <div className="flashcard-content">
                            <h1>Test complete!</h1>
                            <Button text="Edit deck" variant="outlined" to={`/flashcards/edit/${deckId}`}/>
                            <Button text="View all decks" variant="outlined" to={`/flashcards/`}/>
                        </div>
                    }
                </Card>
                <div className="page-bottom">
                {flashcardQueue.length > 0 && flipped &&
                    <>
                        <Button text="Forgot" className="forgot-button" iconLeft={close} variant="outlined" onClick={() => {handleNextCard("forgot")}}/>
                        <Button text="Remembered" className="remember-button" iconLeft={tick} variant="outlined" onClick={() => {handleNextCard("remembered")}}/>  
                    </>
                }
                </div>
            </div>
        )
    }

    return(
        <div className="test-screen">
            <div className="page-header">
                {flashcardQueue && <IconButton icon={close} tooltip="Exit test" onClick={() => {setShowExitModal(true)}}/>}
            </div>
            <div className="page-content">
                {showCard()}
            </div>
            <Modal open={showExitModal}>
                {flashcardQueue && <div className="delete-modal">
                    <h1>End this test?</h1>
                    <p className="delete-modal-description">Only {flashcardQueue.length} cards left. You can do it!</p>
                    <div className="modal-actions">
                        <Button text="Keep going" variant="outlined" onClick={() => {setShowExitModal(false)}}/>
                        <Button text="End test" variant="filled" to={`/flashcards/`} onClick={() => {setShowExitModal(false)}}/>
                    </div>
                </div>}
            </Modal>
        </div>
        
    )
}

export default FlashcardTest