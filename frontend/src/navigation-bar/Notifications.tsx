import IconButton from "../components/IconButton";
import notifications from '../assets/notifications.svg'

function Notifications(){
    return(
        <>
            <IconButton icon={notifications} onClick={() => {console.log('test')}}/>
        </>
    )
}

export default Notifications