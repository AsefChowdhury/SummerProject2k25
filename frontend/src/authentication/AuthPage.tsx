import IconButton from "../components/IconButton/IconButton"
import InputField from "../components/input-field/InputField"
import "./authentication-styles/AuthPage.css"
import visible from "../assets/visible.svg"
import invisible from "../assets/invisible.svg"
import { useState } from "react"
import google from "../assets/google.svg"
import microsoft from "../assets/microsoft.svg"
import arrow_back from "../assets/arrow_back.svg"
import NavigationBar from "../components/navigation-bar/NavigationBar"
import { Link } from "react-router-dom"

type AuthPageProps = {
    mode: "sign-in" | "sign-up"
}

function AuthPage(props: AuthPageProps) {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const maxEmailLength = 254

    const togglePasswordVisibility = () => {
        if(passwordVisible){
            setPasswordVisible(false);
        } else {
            setPasswordVisible(true);
        }
    }

    return(
        <>
            <NavigationBar>
                <div className="back-button-container">
                    <Link to="/"><IconButton icon={arrow_back}/></Link>
                    <p>Back home</p>
                </div>
                
                {props.mode === "sign-in" &&
                    <div className="auth-link">
                        <p>Not a member?</p>
                        <Link className="button" to="/signup">Sign up</Link>
                    </div>
                }
                {props.mode === "sign-up" &&
                    <div className="auth-link">
                        <p>Already a member?</p>
                        <Link className="button" to="/signin">Sign in</Link>
                    </div>
                }

            </NavigationBar>
            <div className="auth-page-body">
                <div className="auth-page-wrapper">
                    <div className="shape shape-one"/>
                    <div className="shape shape-two"/>
                    <form className="auth-page-form">
                        <h1>{props.mode === "sign-in" ? "Sign in" : "Sign up"}</h1><br/>

                        {props.mode === "sign-in" &&
                            <>
                                <label>Username or email</label>
                                <InputField type="text" placeholder="Username or email" maxLength={maxEmailLength} required/><br/>
                            </>
                        }
                        {props.mode === "sign-up" &&
                            <>
                                <label>Username</label>
                                <InputField type="text" placeholder="Username" maxLength={maxEmailLength} required/><br/>
                                <label>Email</label>
                                <InputField type="email" placeholder="Your Email" maxLength={maxEmailLength} required/><br/>
                            </>
                        }
                        
                        <label>Password</label>
                        <InputField id="password" type={passwordVisible ? "text" : "password"} placeholder="Password" maxLength={35} required>
                            <IconButton icon={passwordVisible ?  invisible : visible} onClick={togglePasswordVisibility} tooltip={passwordVisible ? "Hide password" : "Show password"}/>
                        </InputField>
                        <br/>
                        {props.mode === "sign-up" &&
                            <>
                                <label>Confirm password</label>
                                <InputField id="confirm-password" type={passwordVisible ? "text" : "password"} placeholder="Confirm password" maxLength={35} required>
                                    <IconButton icon={passwordVisible ?  invisible : visible} onClick={togglePasswordVisibility} tooltip={passwordVisible ? "Hide password" : "Show password"}/>
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