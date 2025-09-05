import Card from "../card/Card";
import "./Modal.css"

type ModalProps = {
    children: React.ReactNode;
    open: boolean;
    className?: string
}

function Modal(props: ModalProps){
    return(
        <div className={`modal ${props.open ? 'active' : ''}`}>
            <Card className={props.className}>
                {props.children}
            </Card>
            <div className="overlay"></div>
        </div>
    )
}

export default Modal