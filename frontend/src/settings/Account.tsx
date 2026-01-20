import Button from "../components/button/Button"
import InputField from "../components/input-field/InputField"
import "./settings-styles/Account.css"

function Account(){
    return(
        <div className="account-page">
            <h1 className="page-header">Account</h1>
            <form className="account-form">
                <InputField label={{text: "Username", for: "username"}} placeholder="Username" id="username" variant="outlined" />
                <InputField label={{text: "Email", for: "email"}} placeholder="Email" id="email" variant="outlined" />
                <Button type="submit" id="save-button" text="Save changes"/>
            </form>
            <h2 className="page-header delete-account">Delete Account</h2>
            <Button id="delete-account-button" text="Delete my account" variant="outlined"/>
        </div>
    )
}

export default Account