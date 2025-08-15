import "./core-pages-styles/LandingPage.css"
import FeatureCard from "./FeatureCard";
import { useState, useEffect } from "react";

type Tab = "Notes" | "Flashcards" | "Quizzes" | "AI";

function LandingPage(){
    const [activeTab, setActiveTab] = useState<Tab>("Notes");
    const tabs: Tab[] = ["Notes", "Flashcards", "Quizzes", "AI"];
    const [fade, setFade] = useState(false);

    useEffect(() => {
        if (window.innerWidth <= 680) {
            const intervalID = setInterval(() => {
                setFade(true);

                setTimeout(() => {
                    setActiveTab(prev => {
                        const currentIndex = tabs.indexOf(prev);
                        const nextIndex = (currentIndex + 1) % tabs.length;
                        return tabs[nextIndex];
                    });
                    setFade(false)
                }, 300);
            }, 4000);

            return () => {
                clearInterval(intervalID);
            };
        };

    },[]);

    const featureContent:  Record<Tab, { image: string; description: string }> = {
        "Notes": {
            image: "",
            description: "Notes description"
        },
        "Flashcards": {
            image: "",
            description: "Flashcards description"
        },
        "Quizzes": {
            image: "",
            description: "Quizzes description"
        },
        "AI": {
            image: "",
            description: "AI description"
        }
    };

    const handleTabChange = (tab: Tab) => {
        setFade(true);

        setTimeout(() => {
            setActiveTab(tab);
            setFade(false);
        }, 300);
    };

    return(
        <div className="landing-page-main-body">
            <div className="app-info-container">

                <div className={`feature-box ${fade ? "fade" : ""}`}>
                    <FeatureCard
                        image={featureContent[activeTab].image}
                        description={featureContent[activeTab].description}
                    />
                </div>
                
                <div className="app-info-tabs">
                    {tabs.map(tab => (
                        <>
                            <input 
                                type="radio"
                                name="tabs"
                                id={tab}
                                checked={activeTab == tab}
                                onChange={() => handleTabChange(tab)} 
                            />
                            <label htmlFor={tab} className="tab">{tab}</label>
                        </>
                    ))}
                    <span className="glider"/>
                </div>

                <div className="app-info-mobile-view">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`carousel-dot ${activeTab === tab ? "active" : ""}`}
                            onClick={() => {handleTabChange(tab)}}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LandingPage;