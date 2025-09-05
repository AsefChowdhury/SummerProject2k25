import IconButton from "../components/IconButton/IconButton"
import InputField from "../components/input-field/InputField"
import "./authentication-styles/AuthPage.css"
import visible from "../assets/visible.svg?react"
import invisible from "../assets/invisible.svg?react"
import { useState } from "react"
import google from "../assets/google.svg"
import microsoft from "../assets/microsoft.svg"
import arrow_back from "../assets/arrow_back.svg?react"
import NavigationBar from "../components/navigation-bar/NavigationBar"
import { useNavigate } from "react-router-dom"
import api from "../api"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import axios from "axios"
import Button from "../components/button/Button"

type AuthPageProps = {
    mode: "sign-in" | "sign-up"
}

function AuthPage(props: AuthPageProps) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const maxEmailLength = 254

    const togglePasswordVisibility = () => {
        if(passwordVisible){
            setPasswordVisible(false);
        } else {
            setPasswordVisible(true);
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try{
            if(props.mode === "sign-in") {
                const response = await api.post('api/token/', {
                    identifier: username,
                    password: password
                })
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate('/dashboard')
            } else if(props.mode === "sign-up") {
                if (password !== confirmPassword) {
                    throw new Error("Confirm password must match password");
                }
                
                const response = await api.post('api/user/register/', {
                    username: username,
                    email: email,
                    password: password,
                    confirm_password: confirmPassword
                });
                
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate('/dashboard');
            }
        } catch (error) {
            if(axios.isAxiosError(error) && error.response){
                console.log(error.response.data);
            }
        } finally {
            setLoading(false);
        }
    }

    return(
        <>
            <NavigationBar>
                <div className="back-button-container">
                    <IconButton icon={arrow_back} to="/"/>
                    <p>Back home</p>
                </div>
                <div className="auth-link">
                    <p>{props.mode === "sign-in" ? "Not a member?" : "Already a member?"}</p>
                    <Button text={props.mode === "sign-in" ? "Sign up" : "Sign in"} variant="filled" to={props.mode === "sign-in" ? "/sign-up" : "/sign-in"}/>
                </div>
            </NavigationBar>
            <div className="auth-page-body">
                <div className="auth-page-wrapper">
                    <div className="shape shape-one"/>
                    <div className="shape shape-two"/>
                    <form className="auth-page-form" onSubmit={handleSubmit}>
                        <h1>{props.mode === "sign-in" ? "Sign in" : "Sign up"}</h1><br/>

                        {props.mode === "sign-in" &&
                            <>
                                <label>Username or email</label>
                                <InputField value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username or email" maxLength={maxEmailLength} required/><br/>
                            </>
                        }
                        {props.mode === "sign-up" &&
                            <>
                                <label>Username</label>
                                <InputField  value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" maxLength={maxEmailLength} required/><br/>
                                <label>Email</label>
                                <InputField value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your Email" maxLength={maxEmailLength} required/><br/>
                            </>
                        }
                        
                        <label>Password</label>
                        <InputField value={password} onChange={(e) => setPassword(e.target.value)} id="password" type={passwordVisible ? "text" : "password"} placeholder="Password" maxLength={35} required>
                            <div className="show-password-container">
                                <IconButton type="button" icon={passwordVisible ?  invisible : visible} tooltip={passwordVisible ? "Hide password" : "Show password"} onClick={togglePasswordVisibility}/>
                            </div>
                        </InputField>
                        <br/>
                        {props.mode === "sign-up" &&
                            <>
                                <label>Confirm password</label>
                                <InputField value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} id="confirm-password" type={passwordVisible ? "text" : "password"} placeholder="Confirm password" maxLength={35} required>
                                    <div className="show-password-container">
                                        <IconButton type="button" icon={passwordVisible ?  invisible : visible} tooltip={passwordVisible ? "Hide password" : "Show password"} onClick={togglePasswordVisibility}/>
                                    </div>
                                </InputField>
                                <br/>
                            </>
                        }
                        {props.mode === "sign-in" &&
                            <div className="auth-page-remember-password">
                                <div>
                                    <input type="checkbox" className="remember-checkbox"/>
                                    <label>Remember me</label>
                                </div>
                                <a className="forgot-password">Forgot Password?</a>
                            </div>
                        }
                        <button type="submit" className="auth-page-submit-button">{props.mode === "sign-in" ? "Sign in" : "Sign up"}</button>
                        
                        <div className="divider">
                            <span>or</span>
                        </div>
                        
                        <button className="google-sign-in">
                            <img src={google} className="auth-page-icon" alt="Google Icon"/>{props.mode === "sign-in" ? "Sign in with Google" : "Sign up with Google"}
                        </button>
                        <button className="microsoft-sign-in">
                            <img src={microsoft} className="auth-page-icon" alt="Microsoft Icon"/>{props.mode === "sign-in" ? "Sign in with Microsoft" : "Sign up with Microsoft"}
                        </button>
                    </form>                    
                </div>
            </div>
        </>
    )
    
}

export default AuthPage