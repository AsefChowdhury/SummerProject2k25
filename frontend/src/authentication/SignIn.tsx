import "./authentication-styles/SignIn.css"

function SignIn() {
    return(
        <div className="sign-in-body">

            <div className="sign-in-top-bar">
                {/*For now these are placeholders until we implement links */}
                <h3>Home</h3>
                <h3>Create an account? Sign Up</h3>
            </div>

            <div className="sign-in-container">
                <div className="circle circle-one"/>
                <div className="circle circle-two"/>

                <div className="sign-in-form">
                    <h2>Sign In</h2>
                    <form className="sign-in-fields">
                        <h4>Username or Email</h4>
                        <input type="username-or-email" className="username-email-field-sign-in" placeholder='Username or Email' maxLength={35} required/> 
                        <h4>Password</h4>
                        <input type='password' className="password-field-sign-in" placeholder='Password' maxLength={35}></input> 
                        <div className="sign-in-password-options">
                            {/*Implement show password functionatilty */}
                            <input type="checkbox" className="sign-in-show-password"></input>
                            <label>Show password</label>
                            <a className="forgot-password">Forgot Password?</a>
                        </div>
                        <button className="sign-in-submit-button">Sign In</button> {/*Implement Sign In functionality*/}
                        <div className="divider-sign-in">
                            <span>or</span>
                        </div>
                        <div className="social-media-sign-in">
                            {/*Implement Sign up functionality*/}
                            <button className="google-sign-in">Sign in with Google</button>
                            <button className="microsoft-sign-in">Sign in with Microsoft</button>
                        </div>
                    </form>
                </div>
                
            </div>

        </div>
    )
    
}
export default SignIn