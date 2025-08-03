import NavigationBar from "./NavigationBar";
import { Link } from "react-router-dom";
import "./CorePagesNavBar.css";

function CorePagesNavBar() {
    return(
            <NavigationBar>
                <div className="core-pages-logo">Logo</div>

                <div className="core-pages-navigation">
                    <Link to="/" className="link">Home Page</Link>
                    <Link to="/about-us" className="link">About Us</Link>
                    <Link to="/contact-us" className="link">Contact Us</Link>
                </div>

                <div className="auth-link">
                    <Link className="button" to="/sign-up">Sign Up</Link>
                </div>              
            </NavigationBar>
    )
}

export default CorePagesNavBar;