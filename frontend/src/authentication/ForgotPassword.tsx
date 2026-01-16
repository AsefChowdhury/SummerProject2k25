import IconButton from "../components/IconButton/IconButton"
import NavigationBar from "../components/navigation-bar/NavigationBar"
import arrow_back from "../assets/arrow_back.svg?react"
import InputField from "../components/input-field/InputField"
import { useState } from "react";
import Button from "../components/button/Button";
import api from "../api";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateEmail = (email: string) => {
        if (email === "") {
            setEmailError("Email address cannot be empty");
            return false;
        }
        setEmailError("");
        return true;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            return;
        }
        console.log(email)
        setLoading(true);
        await api.post('api/user/reset-password/', {email: email}).then(response => {
            console.log(response);
        }).finally(() => setLoading(false));
        
    };

    return (
        <>
            <NavigationBar>
                <div className="back-button-container">
                    <IconButton icon={arrow_back} to="/auth/sign-in"/>
                    <p>Back to sign in</p>
                </div>
            </NavigationBar>
            <div className="auth-page-body">
                <div className="auth-page-wrapper">
                    <div className="shape shape-one"/>
                    <div className="shape shape-two"/>
                    <form className="auth-page-form" onSubmit={handleSubmit}>
                        <h1>Forgot password</h1><br/>
                        <label>Enter your email address to reset your password.</label>
                        <InputField placeholder="Email address" variant="outlined" type="email" error={emailError} onChange={(e) => setEmail(e.target.value)}/>
                        <br/>
                        <Button loading={loading} type="submit" id="auth-page-submit-button" text="Submit" variant="filled"/>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword