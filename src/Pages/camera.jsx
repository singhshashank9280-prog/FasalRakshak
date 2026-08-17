import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { loadCropModel } from "../Services/cropModel";
import { analyzeCropHybrid } from "../Services/hybridDetection";
import { saveToHistory } from "../Services/history";

import { DISEASE_INFO } from "../data/diseaseInfo";


function Camera() {

    // ========================================================
    // REFS
    // ========================================================

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const streamRef = useRef(null);


    // ========================================================
    // STATE
    // ========================================================

    const [cameraOpen, setCameraOpen] =
        useState(false);

    const [captured, setCaptured] =
        useState(false);

    const [result, setResult] =
        useState(null);

    const [isAnalyzing, setIsAnalyzing] =
        useState(false);

    const [error, setError] =
        useState("");


    // ========================================================
    // LOAD LOCAL MODEL
    // ========================================================

    useEffect(() => {

        loadCropModel()
            .then(() => {

                console.log(
                    "✅ Local crop model ready for camera."
                );

            })
            .catch((error) => {

                console.error(
                    "❌ Local crop model failed:",
                    error
                );

            });

    }, []);


    // ========================================================
    // OPEN CAMERA
    // ========================================================

    const openCamera = async () => {

        try {

            setError("");

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "environment"
                    }
                });


            streamRef.current = stream;


            if (videoRef.current) {

                videoRef.current.srcObject =
                    stream;

            }


            setCameraOpen(true);


            console.log(
                "📷 Camera opened successfully."
            );

        }
        catch (error) {

            console.error(
                "❌ Camera access failed:",
                error
            );


            setError(
                "Could not access camera. Make sure camera permission is allowed and you are using localhost or HTTPS."
            );

        }
    };


    // ========================================================
    // CAPTURE IMAGE
    // ========================================================

    const captureImage = () => {

        const video =
            videoRef.current;

        const canvas =
            canvasRef.current;


        if (
            !video ||
            !video.srcObject
        ) {

            alert(
                "Open the camera first."
            );

            return;
        }


        if (
            video.videoWidth === 0 ||
            video.videoHeight === 0
        ) {

            alert(
                "Camera is not ready yet."
            );

            return;
        }


        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;


        const ctx =
            canvas.getContext("2d");


        ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        setCaptured(true);
        setResult(null);
        setError("");


        console.log(
            "📷 Image captured successfully."
        );
    };


    // ========================================================
    // ANALYZE CAPTURED IMAGE
    // ========================================================

    const analyzeCameraImage = async () => {

        const canvas =
            canvasRef.current;


        if (
            !canvas ||
            canvas.width === 0
        ) {

            alert(
                "Please capture an image first."
            );

            return;
        }


        setIsAnalyzing(true);
        setResult(null);
        setError("");


        try {

            console.log(
                "📷 Starting camera image analysis..."
            );


            // ------------------------------------------------
            // Convert canvas to Base64
            // ------------------------------------------------

            const imageData =
                canvas.toDataURL(
                    "image/jpeg",
                    0.8
                );


            // ------------------------------------------------
            // HYBRID DETECTION
            // ------------------------------------------------

            console.log(
                "🌱 Running hybrid detection..."
            );


            const detectionResult =
                await analyzeCropHybrid(
                    canvas,
                    imageData,
                    ""
                );


            console.log(
                "🌱 Camera hybrid result:",
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


            // ------------------------------------------------
            // SAVE HISTORY
            // ------------------------------------------------

            const historyName =
                detectionResult.mode === "online"
                    ? "Gemini AI Analysis"
                    : detectionResult.prediction;


            const historyConfidence =
                detectionResult.mode === "online"
                    ? 0
                    : detectionResult.confidence;


            saveToHistory(
                historyName,
                historyConfidence,
                imageData
            );


        }
        catch (error) {

            console.error(
                "❌ Camera analysis failed:",
                error
            );


            setError(
                error.message ||
                "Camera image analysis failed."
            );

        }
        finally {

            setIsAnalyzing(false);

        }
    };


    // ========================================================
    // STOP CAMERA
    // ========================================================

    const stopCamera = () => {

        if (streamRef.current) {

            streamRef.current
                .getTracks()
                .forEach(
                    (track) => track.stop()
                );

            streamRef.current = null;

        }


        if (videoRef.current) {

            videoRef.current.srcObject =
                null;

        }


        setCameraOpen(false);


        console.log(
            "📷 Camera stopped."
        );
    };


    // ========================================================
    // CLEANUP CAMERA
    // ========================================================

    useEffect(() => {

        return () => {

            if (streamRef.current) {

                streamRef.current
                    .getTracks()
                    .forEach(
                        (track) => track.stop()
                    );

            }

        };

    }, []);


    // ========================================================
    // RENDER RESULT
    // ========================================================

    const renderResult = () => {

        if (!result) {
            return null;
        }


        // ====================================================
        // ONLINE
        // ====================================================

        if (result.mode === "online") {

            const analysis =
                result.analysis;


            if (
                typeof analysis === "string"
            ) {

                return (

                    <div className="result-box">

                        <div
                            style={{
                                background:
                                    "#e8f5e9",
                                padding:
                                    "12px",
                                borderRadius:
                                    "8px",
                                marginBottom:
                                    "15px"
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
                                lineHeight:
                                    "1.6"
                            }}
                        >
                            {analysis}
                        </p>

                    </div>

                );
            }


            return (

                <div className="result-box">

                    <div
                        style={{
                            background:
                                "#e8f5e9",
                            padding:
                                "12px",
                            borderRadius:
                                "8px",
                            marginBottom:
                                "15px"
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
        // OFFLINE
        // ====================================================

        if (result.mode === "offline") {

            const info =
                DISEASE_INFO[
                    result.prediction
                ] || {

                    name:
                        result.prediction,

                    cause:
                        "No information available.",

                    precautions:
                        "-",

                    remedy:
                        "-"
                };


            return (

                <div className="result-box">

                    <div
                        style={{
                            background:
                                "#fff3cd",
                            padding:
                                "10px",
                            borderRadius:
                                "8px",
                            marginBottom:
                                "12px"
                        }}
                    >

                        <strong>
                            📴 Offline — Local Model
                        </strong>

                    </div>


                    <h2>
                        {info.name}
                    </h2>


                    <p>

                        <strong>
                            Confidence:
                        </strong>{" "}

                        {result.confidence}%

                    </p>


                    <p>

                        <strong>
                            Likely cause:
                        </strong>{" "}

                        {info.cause}

                    </p>


                    <p>

                        <strong>
                            Precautions:
                        </strong>{" "}

                        {info.precautions}

                    </p>


                    <p>

                        <strong>
                            Remedy:
                        </strong>{" "}

                        {info.remedy}

                    </p>

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


            {/* ================= CAMERA ================= */}

            <div className="page-container">

                <h1>
                    Capture Crop Image 📷
                </h1>


                <p>
                    Use your live camera to capture
                    crop images for disease analysis.
                </p>


                {/* LIVE CAMERA */}

                <div className="camera-box">

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                    />

                </div>


                {/* CAMERA BUTTONS */}

                <div className="camera-buttons">

                    <button
                        onClick={openCamera}
                    >
                        Open Camera
                    </button>


                    <button
                        onClick={captureImage}
                        disabled={!cameraOpen}
                    >
                        Capture Image
                    </button>


                    {cameraOpen && (

                        <button
                            onClick={stopCamera}
                        >
                            Stop Camera
                        </button>

                    )}

                </div>


                {/* CAPTURED IMAGE */}

                <h2>
                    Captured Image
                </h2>


                <canvas
                    ref={canvasRef}
                    style={{
                        maxWidth: "100%"
                    }}
                />


                <br />


                <button
                    onClick={analyzeCameraImage}
                    disabled={
                        !captured ||
                        isAnalyzing
                    }
                >

                    {isAnalyzing
                        ? "🔍 Analyzing..."
                        : "Analyze Crop"}

                </button>


                {/* ERROR */}

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
                            ❌ Error
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* RESULT */}

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


            {/* ================= TIPS ================= */}

            <div className="page-container">

                <h1>
                    Tips for Better Images
                </h1>


                <div className="cards">

                    <div className="card">

                        <h3>
                            Good Lighting
                        </h3>

                        <p>
                            Capture images in natural
                            light for better results.
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            Clear Leaf Image
                        </h3>

                        <p>
                            Keep the infected area visible
                            and focused.
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            Avoid Blur
                        </h3>

                        <p>
                            Hold the camera steady while
                            capturing.
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


export default Camera;