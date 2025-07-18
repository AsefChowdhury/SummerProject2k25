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
                        <input type='password' className="password-field-signup" placeholder='Password' maxLength={35}/> 
                        <h4>Confirm Password</h4>
                        <input type='password' className="confirm-password-field-signup" placeholder='Confirm Password' maxLength={35}/>
                    </form>
                    <button className="sign-up-submit-button">Sign Up</button>
                </div>
                
            </div>

        </div>
    )
}

export default SignUp