import "./authentication-styles/SignUp.css"

function SignUp() {
    return(
        <div className="sign-up-body">

            <div className="sign-up-top-bar">
                {/*For now these are placeholders until we implement links */}
                <h3>Home</h3>
                <h3>Already have an account ? Sign In</h3>
            </div>

            <div className="sign-up-container">
                <div className="shape shape-one"/>
                <div className="shape shape-two"/>

                <div className="sign-up-form">
                    <h2>Create An Account</h2>
                    <form className="sign-up-fields">
                        <h4>Username</h4>
                        <input type="username" className="username-field-signup" placeholder='Username' maxLength={35} required/> 
                        <h4>Email</h4>
                        <input type='email' className="email-field-signup" placeholder='Your Email' maxLength={35}/> 
                        <h4>Password</h4>
                        <input type='password' className="password-field-signup" placeholder='Password' maxLength={35}></input> 
                        <div className="sign-up-password-visibility">
                            {/*Implement show password functionatilty */}
                            <input type="checkbox" className="sign-up-show-password"></input>
                            <label>Show password</label>
                        </div>
                        <button className="sign-up-submit-button">Sign Up</button> {/*Implement Sign up functionality*/}
                        <div className="divider">
                            <span>or</span>
                        </div>
                        <div className="social-media-sign-up">
                            {/*Implement Sign up functionality*/}
                            <button className="google-sign-up">Sign up with Google</button>
                            <button className="microsoft-sign-up">Sign up with Microsoft</button>
                        </div>
                    </form>
                </div>
                
            </div>

        </div>
    )
}

export default SignUp