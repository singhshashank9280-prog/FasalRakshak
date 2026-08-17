import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getHistory,
    clearHistory as clearHistoryStorage
} from "../Services/history";


function History() {

    const [history, setHistory] =
        useState([]);


    // ========================================================
    // LOAD HISTORY
    // ========================================================

    useEffect(() => {

        setHistory(
            getHistory()
        );

    }, []);


    // ========================================================
    // CLEAR HISTORY
    // ========================================================

    const clearHistory = () => {

        const confirmed =
            window.confirm(
                "Clear all detection history? This cannot be undone."
            );


        if (!confirmed) {

            return;

        }


        clearHistoryStorage();

        setHistory([]);

    };


    // ========================================================
    // UI
    // ========================================================

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


            {/* ================= HISTORY ================= */}

            <div className="page-container">

                <h1>
                    Detection History 🕒
                </h1>


                <p>
                    A record of your past crop disease
                    detections, stored on this device.
                </p>


                {/* ================= SUMMARY ================= */}

                {history.length > 0 && (

                    <p>

                        <strong>
                            Total detections:
                        </strong>{" "}

                        {history.length}

                    </p>

                )}


                {/* ================= CLEAR BUTTON ================= */}

                <button
                    onClick={clearHistory}
                    disabled={history.length === 0}
                    style={{
                        background:
                            history.length === 0
                                ? "#999"
                                : "#c0392b"
                    }}
                >
                    🗑️ Clear History
                </button>


                {/* ================= EMPTY STATE ================= */}

                {history.length === 0 ? (

                    <div
                        className="result-box"
                        style={{
                            marginTop: "20px"
                        }}
                    >

                        <h3>
                            📭 No Detection History
                        </h3>

                        <p>
                            No detections yet. Go to
                            Disease Detection to analyze
                            a crop leaf.
                        </p>


                        <Link to="/disease">

                            <button>
                                🌱 Detect a Disease
                            </button>

                        </Link>

                    </div>

                ) : (

                    /* ================= HISTORY LIST ================= */

                    <div
                        className="cards"
                        style={{
                            marginTop: "20px"
                        }}
                    >

                        {history.map(
                            (entry, index) => (

                                <div
                                    className="card"
                                    style={{
                                        width: "250px"
                                    }}
                                    key={
                                        `${entry.timestamp}-${index}`
                                    }
                                >

                                    {/* IMAGE */}

                                    {entry.imageSrc ? (

                                        <img
                                            src={
                                                entry.imageSrc
                                            }
                                            alt={
                                                entry.diseaseName
                                            }
                                            style={{
                                                width: "100%",
                                                height: "160px",
                                                objectFit:
                                                    "cover",
                                                borderRadius:
                                                    "10px",
                                                marginBottom:
                                                    "10px"
                                            }}
                                        />

                                    ) : (

                                        <div
                                            style={{
                                                height:
                                                    "160px",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                background:
                                                    "#eee",
                                                borderRadius:
                                                    "10px",
                                                marginBottom:
                                                    "10px"
                                            }}
                                        >

                                            🌱 No Image

                                        </div>

                                    )}


                                    {/* DISEASE */}

                                    <h3>
                                        {
                                            entry.diseaseName
                                        }
                                    </h3>


                                    {/* CONFIDENCE */}

                                    <p>

                                        <strong>
                                            Confidence:
                                        </strong>{" "}

                                        {entry.confidence}%

                                    </p>


                                    {/* TIMESTAMP */}

                                    <p
                                        style={{
                                            fontSize:
                                                "13px",
                                            color:
                                                "#777"
                                        }}
                                    >
                                        {
                                            entry.timestamp
                                        }
                                    </p>

                                </div>

                            )
                        )}

                    </div>

                )}

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


export default History;