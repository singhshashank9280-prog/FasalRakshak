import { useState } from "react";
import { Link } from "react-router-dom";

import {
    UI_STRINGS,
    findDiseaseMatch
} from "../data/languageData";

import {
    DISEASE_INFO
} from "../data/diseaseInfo";


function Language() {

    const [language, setLanguage] =
        useState("english");

    const [question, setQuestion] =
        useState("");

    const [answer, setAnswer] =
        useState(null);


    // ========================================================
    // ASK QUESTION
    // ========================================================

    const askQuestion = () => {

        const strings =
            UI_STRINGS[language] ||
            UI_STRINGS.english;


        const text =
            question
                .trim()
                .toLowerCase();


        if (!text) {

            setAnswer({
                type: "error",
                message: strings.noMatch
            });

            return;
        }


        const matchKey =
            findDiseaseMatch(text);


        if (!matchKey) {

            setAnswer({
                type: "error",
                message: strings.noMatch
            });

            return;
        }


        const match =
            DISEASE_INFO[matchKey];


        setAnswer({
            type: "success",
            match
        });

    };


    const strings =
        UI_STRINGS[language] ||
        UI_STRINGS.english;


    return (
        <>

            {/* ================= NAVBAR ================= */}

            <header>

                <nav>

                    <div className="logo">
                        🌱 FasalRakshak
                    </div>


                    <div className="nav-links">

                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/disease">
                            Disease Detection
                        </Link>

                        <Link to="/camera">
                            Image Capture
                        </Link>

                        <Link to="/voice">
                            Voice Assistant
                        </Link>

                        <Link to="/language">
                            Language
                        </Link>

                        <Link to="/history">
                            History
                        </Link>

                        <Link to="/about">
                            About
                        </Link>

                    </div>

                </nav>

            </header>


            {/* ================= LANGUAGE ASSISTANT ================= */}

            <div className="page-container">

                <h1>
                    Multilingual Farmer Assistant 🌍
                </h1>


                <p>
                    Select your preferred language and
                    communicate easily.
                </p>


                {/* ================= LANGUAGE ================= */}

                <select
                    value={language}
                    onChange={(event) => {

                        setLanguage(
                            event.target.value
                        );

                        setAnswer(null);

                    }}
                >

                    <option value="english">
                        English
                    </option>

                    <option value="hindi">
                        हिंदी (Hindi)
                    </option>

                    <option value="bengali">
                        বাংলা (Bengali)
                    </option>

                    <option value="telugu">
                        తెలుగు (Telugu)
                    </option>

                    <option value="marathi">
                        मराठी (Marathi)
                    </option>

                    <option value="tamil">
                        தமிழ் (Tamil)
                    </option>

                    <option value="gujarati">
                        ગુજરાતી (Gujarati)
                    </option>

                    <option value="kannada">
                        ಕನ್ನಡ (Kannada)
                    </option>

                    <option value="malayalam">
                        മലയാളം (Malayalam)
                    </option>

                    <option value="punjabi">
                        ਪੰਜਾਬੀ (Punjabi)
                    </option>

                    <option value="odia">
                        ଓଡ଼ିଆ (Odia)
                    </option>

                    <option value="assamese">
                        অসমীয়া (Assamese)
                    </option>

                </select>


                {/* ================= QUESTION ================= */}

                <h2>
                    {strings.heading}
                </h2>


                <textarea
                    value={question}
                    onChange={(event) =>
                        setQuestion(
                            event.target.value
                        )
                    }
                    placeholder={
                        strings.placeholder
                    }
                    rows="6"
                    style={{
                        width: "100%",
                        maxWidth: "700px",
                        padding: "12px",
                        fontSize: "16px",
                        resize: "vertical"
                    }}
                />


                <br />
                <br />


                {/* ================= BUTTON ================= */}

                <button
                    onClick={askQuestion}
                >
                    {strings.button}
                </button>


                {/* ================= ANSWER ================= */}

                {answer && (

                    <div
                        className="result-box"
                        style={{
                            marginTop: "20px"
                        }}
                    >

                        {answer.type === "error" ? (

                            <p>
                                {answer.message}
                            </p>

                        ) : (

                            <>

                                <h2>
                                    {strings.found}
                                </h2>


                                <h3>
                                    {answer.match.name}
                                </h3>


                                <p>
                                    <strong>
                                        {strings.cause}:
                                    </strong>{" "}
                                    {answer.match.cause}
                                </p>


                                <p>
                                    <strong>
                                        {strings.precautions}:
                                    </strong>{" "}
                                    {answer.match.precautions}
                                </p>


                                <p>
                                    <strong>
                                        {strings.remedy}:
                                    </strong>{" "}
                                    {answer.match.remedy}
                                </p>

                            </>

                        )}

                    </div>

                )}

            </div>


            {/* ================= SUPPORTED LANGUAGES ================= */}

            <div className="page-container">

                <h1>
                    Supported Languages
                </h1>


                <div className="cards">

                    <div className="card">

                        <h3>
                            हिंदी
                        </h3>

                        <p>
                            North and Central India
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            অসমীয়া
                        </h3>

                        <p>
                            Assam and Northeast India
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            தமிழ்
                        </h3>

                        <p>
                            Tamil Nadu region
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            తెలుగు
                        </h3>

                        <p>
                            Andhra Pradesh and Telangana
                        </p>

                    </div>

                </div>

            </div>


            {/* ================= FOOTER ================= */}

            <footer>

                <h3>
                    🌱 FasalRakshak
                </h3>

                <p>
                    Smart agriculture support platform
                    for better crop health.
                </p>

                <p>
                    © 2026 FasalRakshak.
                    All rights reserved.
                </p>

            </footer>

        </>
    );
}


export default Language;