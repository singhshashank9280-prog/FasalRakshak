import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { loadCropModel } from "../Services/cropModel";
import { analyzeCropHybrid } from "../Services/hybridDetection";

import {
    DISEASE_INFO,
    ALT_CROPS
} from "../data/diseaseInfo";

import { saveToHistory } from "../Services/history";

import Voice from "../components/Voice";

const voiceLanguages = {
    english: "en-IN",
    bengali: "bn-IN",
    telugu: "te-IN",
    marathi: "mr-IN",
    odia: "or-IN",
    assamese: "as-IN"
};

function Disease() {

    // ========================================================
    // STATE
    // ========================================================

    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const [result, setResult] = useState(null);

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [error, setError] = useState("");


    // ========================================================
    // LOAD LOCAL MODEL
    // ========================================================

    useEffect(() => {

        loadCropModel()
            .then(() => {

                console.log(
                    "✅ Local crop model test passed!"
                );

            })
            .catch((error) => {

                console.error(
                    "❌ Local crop model test failed:",
                    error
                );

            });

    }, []);


    // ========================================================
    // IMAGE SELECTION
    // ========================================================

    const handleImageChange = (event) => {

        const file = event.target.files[0];

        if (!file) {

            setSelectedImage(null);
            setPreviewUrl("");
            setResult(null);
            setError("");

            return;
        }


        setSelectedImage(file);

        setResult(null);
        setError("");


        const url =
            URL.createObjectURL(file);

        setPreviewUrl(url);
    };


    // ========================================================
    // CONVERT IMAGE TO BASE64
    // ========================================================

    const imageToDataURL = (file) => {

        return new Promise((resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload = () => {

                resolve(reader.result);

            };


            reader.onerror = () => {

                reject(
                    new Error(
                        "Failed to read image."
                    )
                );

            };


            reader.readAsDataURL(file);
        });
    };


    // ========================================================
    // DETECT DISEASE
    // ========================================================

    const detectDisease = async () => {

        if (!selectedImage) {

            alert(
                "Please select a crop image first."
            );

            return;
        }


        setIsAnalyzing(true);

        setResult(null);

        setError("");


        try {

            console.log(
                "📷 Starting disease detection..."
            );


            // ------------------------------------------------
            // Convert uploaded image to Base64
            // ------------------------------------------------

            const imageData =
                await imageToDataURL(
                    selectedImage
                );


            console.log(
                "📷 Image converted successfully."
            );


            // ------------------------------------------------
            // Create image element for local model
            // ------------------------------------------------

            const imageElement =
                new Image();


            imageElement.src =
                previewUrl;


            await new Promise(
                (resolve, reject) => {

                    imageElement.onload =
                        resolve;

                    imageElement.onerror =
                        reject;
                }
            );


            // ------------------------------------------------
            // HYBRID DETECTION
            // ------------------------------------------------

            console.log(
                "🌱 Running hybrid detection..."
            );


            const detectionResult =
                await analyzeCropHybrid(
                    imageElement,
                    imageData
                );


            console.log(
                "🌱 Hybrid detection result:",
                detectionResult
            );


            if (
                !detectionResult ||
                !detectionResult.success
            ) {

                throw new Error(
                    "Image analysis failed."
                );

            }


           setResult(
                detectionResult
            );


            // ====================================================
            // SAVE DETECTION HISTORY
            // ====================================================

            if (detectionResult.mode === "online") {

                saveToHistory(
                    "Gemini AI Analysis",
                    0,
                    imageData
                );

            }
            else if (detectionResult.mode === "offline") {

                const info =
                    DISEASE_INFO[
                        detectionResult.prediction
                    ];

                const diseaseName =
                    info
                        ? info.name
                        : detectionResult.prediction;


                saveToHistory(
                    diseaseName,
                    detectionResult.confidence,
                    imageData
                );

            }

                    }
                    catch (error) {

                        console.error(
                            "❌ Disease detection failed:",
                            error
                        );


                        setError(
                            error.message ||
                            "Disease detection failed."
                        );

                    }
                    finally {

                        setIsAnalyzing(false);

                    }
                };


    // ========================================================
    // OFFLINE RESULT INFORMATION
    // ========================================================

    const getOfflineInfo = () => {

        if (
            !result ||
            result.mode !== "offline"
        ) {

            return null;
        }


        return (
            DISEASE_INFO[
                result.prediction
            ] || {

                name:
                    result.prediction,

                cropFamily:
                    "Unknown",

                cause:
                    "No information available for this class.",

                precautions:
                    "-",

                remedy:
                    "-"
            }
        );
    };


    // ========================================================
    // RENDER RESULT
    // ========================================================

    const renderResult = () => {

        if (!result) {
            return null;
        }


        // ====================================================
        // ONLINE → GEMINI
        // ====================================================

        if (result.mode === "online") {

            const analysis =
                result.analysis;


            // Gemini returned plain text
            if (
                typeof analysis === "string"
            ) {

                return (

                    <div className="result-box">

                        <div
                            style={{
                                background: "#e8f5e9",
                                padding: "12px",
                                borderRadius: "8px",
                                marginBottom: "15px"
                            }}
                        >

                            <strong>
                                🌐 Online — Gemini AI
                            </strong>

                        </div>


                        <p
                            style={{
                                whiteSpace:
                                    "pre-wrap",
                                lineHeight: "1.6"
                            }}
                        >
                            {analysis}
                        </p>

                    </div>

                );
            }


            // Gemini returned structured data
            return (

                <div className="result-box">

                    <div
                        style={{
                            background: "#e8f5e9",
                            padding: "12px",
                            borderRadius: "8px",
                            marginBottom: "15px"
                        }}
                    >

                        <strong>
                            🌐 Online — Gemini AI
                        </strong>

                    </div>


                    <h2>
                        {analysis?.crop ||
                            "Crop Analysis"}
                    </h2>


                    <p>
                        <strong>
                            Disease:
                        </strong>{" "}

                        {analysis?.disease ||
                            "Unknown"}
                    </p>


                    <p>
                        <strong>
                            Cause:
                        </strong>{" "}

                        {analysis?.cause ||
                            "Not available"}
                    </p>


                    <p>
                        <strong>
                            Precautions:
                        </strong>{" "}

                        {analysis?.precautions ||
                            "Not available"}
                    </p>


                    <p>
                        <strong>
                            Remedy:
                        </strong>{" "}

                        {analysis?.remedy ||
                            "Not available"}
                    </p>

                </div>

            );
        }


        // ====================================================
        // OFFLINE → TEACHABLE MACHINE
        // ====================================================

        if (result.mode === "offline") {

            const info =
                getOfflineInfo();


            const confidence =
                result.confidence;


            const isHealthy =
                info.name
                    .toLowerCase()
                    .includes("healthy");


            let severity =
                0;

            let recovery =
                "";


            if (isHealthy) {

                severity = 5;

                recovery =
                    "Not applicable — crop is healthy.";

            }
            else if (
                confidence >= 80
            ) {

                severity = 70;

                recovery =
                    "Moderate to low — act quickly.";

            }
            else if (
                confidence >= 60
            ) {

                severity = 45;

                recovery =
                    "Good — early stage, monitor closely.";

            }
            else {

                severity = 25;

                recovery =
                    "Uncertain diagnosis — try a clearer photo.";
            }


            // Alternative crops

            const alternatives =
                ALT_CROPS[
                    info.cropFamily
                ] || [];


            return (

                <div className="result-box">

                    {/* MODE */}

                    <div
                        style={{
                            background: "#fff3cd",
                            padding: "10px",
                            borderRadius: "8px",
                            marginBottom: "12px"
                        }}
                    >

                        <strong>
                            📴 Offline — Local Model
                        </strong>

                    </div>


                    {/* DISEASE */}

                    <h2>
                        {info.name}
                    </h2>


                    {/* CONFIDENCE */}

                    <p>

                        <strong>
                            Confidence:
                        </strong>{" "}

                        {confidence}%

                    </p>


                    {/* SEVERITY */}

                    <p>

                        <strong>
                            Estimated severity:
                        </strong>

                    </p>


                    <div
                        style={{
                            background:
                                "#e0e0e0",
                            borderRadius:
                                "6px",
                            height:
                                "14px",
                            overflow:
                                "hidden",
                            marginBottom:
                                "10px"
                        }}
                    >

                        <div
                            style={{
                                height:
                                    "100%",
                                width:
                                    `${severity}%`,
                                background:
                                    "#e53935"
                            }}
                        />

                    </div>


                    {/* RECOVERY */}

                    <p>

                        <strong>
                            Recovery chance:
                        </strong>{" "}

                        {recovery}

                    </p>


                    {/* CAUSE */}

                    <p>

                        <strong>
                            Likely cause:
                        </strong>{" "}

                        {info.cause}

                    </p>


                    {/* PRECAUTIONS */}

                    <p>

                        <strong>
                            Precautions:
                        </strong>{" "}

                        {info.precautions}

                    </p>


                    {/* REMEDY */}

                    <p>

                        <strong>
                            Remedy:
                        </strong>{" "}

                        {info.remedy}

                    </p>


                    {/* OTHER POSSIBILITIES */}

                    {result.predictions &&
                        result.predictions.length >
                            1 && (

                            <>

                                <p>

                                    <strong>
                                        Other possibilities:
                                    </strong>

                                </p>


                                <ul>

                                    {result.predictions
                                        .slice(1, 3)
                                        .map(
                                            (prediction) => {

                                                const
                                                    otherInfo =
                                                        DISEASE_INFO[
                                                            prediction.className
                                                        ];


                                                const
                                                    otherName =
                                                        otherInfo
                                                            ? otherInfo.name
                                                            : prediction.className;


                                                return (

                                                    <li
                                                        key={
                                                            prediction.className
                                                        }
                                                    >

                                                        {otherName}

                                                        {" - "}

                                                        {Math.round(
                                                            prediction.probability *
                                                            100
                                                        )}

                                                        %

                                                    </li>

                                                );

                                            }
                                        )}

                                </ul>

                            </>

                        )}


                    {/* ALTERNATIVE CROPS */}

                    {alternatives.length >
                        0 && (

                        <>

                            <p>

                                <strong>
                                    Alternative crops:
                                </strong>

                            </p>


                            <ul>

                                {alternatives.map(
                                    (crop) => (

                                        <li
                                            key={
                                                crop.name
                                            }
                                        >

                                            <strong>
                                                {crop.name}
                                            </strong>

                                            {" — "}

                                            {crop.reason}

                                        </li>

                                    )
                                )}

                            </ul>

                        </>
                    )}

                </div>

            );
        }


        return null;
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


            {/* ================= FARM SUMMARY ================= */}

            <div
                className="page-container"
                style={{
                    marginBottom: 0
                }}
            >

                <div className="farm-summary-banner">

                    {/* Farm summary will be connected later */}

                </div>

            </div>


            {/* ================= DISEASE DETECTION ================= */}

            <div className="page-container">

                <h1>
                    Crop Disease Detection 🌱
                </h1>


                <p>
                    Upload a crop image and analyze the
                    health condition of your crop.
                </p>


                {/* ================= IMAGE UPLOAD ================= */}

                <input
                    type="file"
                    id="cropImage"
                    accept="image/*"
                    onChange={
                        handleImageChange
                    }
                />


                {/* ================= IMAGE PREVIEW ================= */}

                {previewUrl && (

                    <img
                        id="previewImage"
                        src={previewUrl}
                        alt="Crop Preview"
                        style={{
                            maxWidth: "100%",
                            marginTop: "15px"
                        }}
                    />

                )}


                <br />


                {/* ================= DETECT BUTTON ================= */}

                <button
                    onClick={detectDisease}
                    disabled={isAnalyzing}
                >

                    {isAnalyzing
                        ? "🔍 Analyzing..."
                        : "Detect Disease"}

                </button>


                {/* ================= ERROR ================= */}

                {error && (

                    <div
                        style={{
                            background:
                                "#fdecea",
                            color:
                                "#b71c1c",
                            padding:
                                "12px",
                            borderRadius:
                                "8px",
                            marginTop:
                                "15px"
                        }}
                    >

                        <strong>
                            ❌ Analysis failed
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* ================= RESULT ================= */}

                {result && (

                    <div
                        style={{
                            marginTop:
                                "20px"
                        }}
                    >

                        {renderResult()}

                    </div>

                )}

            </div>


            {/* ================= HOW IT WORKS ================= */}

            <div className="page-container">

                <h1>
                    How It Works
                </h1>


                <div className="cards">

                    <div className="card">

                        <h3>
                            Step 1
                        </h3>

                        <p>
                            Upload a clear image of the
                            crop leaf.
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            Step 2
                        </h3>

                        <p>
                            System analyzes the crop
                            condition.
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            Step 3
                        </h3>

                        <p>
                            Get disease information and
                            prevention tips.
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


export default Disease;