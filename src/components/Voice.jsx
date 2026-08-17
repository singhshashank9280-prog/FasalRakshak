import { useState } from "react";

import {
    startSpeechRecognition,
    speakText
} from "../Services/voiceService";


function Voice() {

    const [language, setLanguage] =
        useState("english");

    const [isListening, setIsListening] =
        useState(false);

    const [transcript, setTranscript] =
        useState("");

    const [response, setResponse] =
        useState("");

    const [error, setError] =
        useState("");


    // ========================================================
    // START VOICE RECOGNITION
    // ========================================================

    const startListening = () => {

        setError("");

        try {

            startSpeechRecognition(

                language,

                // ----------------------------
                // Speech recognized
                // ----------------------------

                (text) => {

                    setTranscript(text);

                    generateResponse(text);

                },

                // ----------------------------
                // Recognition started
                // ----------------------------

                () => {

                    setIsListening(true);

                },

                // ----------------------------
                // Recognition error
                // ----------------------------

                (event) => {

                    console.error(
                        "Speech recognition error:",
                        event.error
                    );

                    setIsListening(false);


                    if (event.error === "no-speech") {

                        setError(
                            "No speech detected. Please try speaking again."
                        );

                    }
                    else if (
                        event.error === "not-allowed"
                    ) {

                        setError(
                            "Microphone permission was denied. Please allow microphone access."
                        );

                    }
                    else if (
                        event.error === "audio-capture"
                    ) {

                        setError(
                            "No microphone was detected."
                        );

                    }
                    else {

                        setError(
                            "Speech recognition failed. Please try again."
                        );

                    }

                },

                // ----------------------------
                // Recognition ended
                // ----------------------------

                () => {

                    setIsListening(false);

                }

            );

        }
        catch (error) {

            console.error(
                "Voice assistant error:",
                error
            );

            setIsListening(false);

            setError(
                error.message ||
                "Voice assistant is not supported."
            );

        }

    };


    // ========================================================
    // GENERATE RESPONSE
    // ========================================================

    const generateResponse = (text) => {

        const input =
            text.toLowerCase();


        let reply =
            "Sorry, I could not understand your question.";


        // ----------------------------
        // Greeting
        // ----------------------------

        if (
            input.includes("hello") ||
            input.includes("hi")
        ) {

            reply =
                "Hello! How can I help you with your crop today?";

        }


        // ----------------------------
        // Disease
        // ----------------------------

        else if (
            input.includes("disease")
        ) {

            reply =
                "You can upload a crop leaf image in the Disease Detection section to identify possible diseases.";

        }


        // ----------------------------
        // Healthy crop
        // ----------------------------

        else if (
            input.includes("healthy")
        ) {

            reply =
                "A healthy crop usually has normal green leaves without unusual spots, discoloration, or wilting.";

        }


        // ----------------------------
        // Fertilizer
        // ----------------------------

        else if (
            input.includes("fertilizer")
        ) {

            reply =
                "Use fertilizer according to your crop type and soil condition. Avoid excessive fertilizer.";

        }


        setResponse(reply);

        speak(reply);

    };


    // ========================================================
    // TEXT TO SPEECH
    // ========================================================

    const speak = (text) => {

        speakText(
            text,
            language
        );

    };


    // ========================================================
    // LANGUAGE CHANGE
    // ========================================================

    const handleLanguageChange = (event) => {

        const newLanguage =
            event.target.value;


        setLanguage(newLanguage);

        setTranscript("");

        setResponse("");

        setError("");

    };


    // ========================================================
    // UI
    // ========================================================

    return (

        <div className="page-container">

            <h1>
                🎤 Voice Assistant
            </h1>


            <p>
                Ask questions about your crop using
                your voice.
            </p>


            {/* ================= LANGUAGE ================= */}

            <div>

                <label>
                    Select Language:
                </label>


                <select
                    value={language}
                    onChange={
                        handleLanguageChange
                    }
                    disabled={isListening}
                >

                    <option value="english">
                        English
                    </option>

                    <option value="bengali">
                        Bengali
                    </option>

                    <option value="telugu">
                        Telugu
                    </option>

                    <option value="marathi">
                        Marathi
                    </option>

                    <option value="odia">
                        Odia
                    </option>

                    <option value="assamese">
                        Assamese
                    </option>

                </select>

            </div>


            {/* ================= MICROPHONE ================= */}

            <div
                style={{
                    marginTop: "20px"
                }}
            >

                <button
                    onClick={startListening}
                    disabled={isListening}
                >

                    {isListening
                        ? "🎙️ Listening..."
                        : "🎤 Start Speaking"}

                </button>

            </div>


            {/* ================= ERROR ================= */}

            {error && (

                <div
                    style={{
                        background: "#fdecea",
                        color: "#b71c1c",
                        padding: "12px",
                        borderRadius: "8px",
                        marginTop: "15px"
                    }}
                >

                    <strong>
                        ❌ Voice Error
                    </strong>

                    <p>
                        {error}
                    </p>

                </div>

            )}


            {/* ================= USER SPEECH ================= */}

            {transcript && (

                <div
                    className="result-box"
                    style={{
                        marginTop: "20px"
                    }}
                >

                    <h3>
                        🗣️ You said
                    </h3>

                    <p>
                        {transcript}
                    </p>

                </div>

            )}


            {/* ================= RESPONSE ================= */}

            {response && (

                <div
                    className="result-box"
                    style={{
                        marginTop: "15px"
                    }}
                >

                    <h3>
                        🤖 FasalRakshak
                    </h3>

                    <p>
                        {response}
                    </p>


                    <button
                        onClick={() =>
                            speak(response)
                        }
                    >

                        🔊 Speak Response

                    </button>

                </div>

            )}

        </div>

    );

}


export default Voice;