import { useState } from "react";
import { Link } from "react-router-dom";


// ========================================================
// FORMSPREE
// ========================================================

const FORMSPREE_ENDPOINT =
    "https://formspree.io/f/maewwrqe";


function About() {

    // ========================================================
    // CONTACT FORM STATE
    // ========================================================

    const [contactStatus, setContactStatus] =
        useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);


    // ========================================================
    // CONTACT FORM SUBMIT
    // ========================================================

    const handleContactSubmit = async (event) => {

        event.preventDefault();

        if (isSubmitting) {
            return;
        }


        const form =
            event.currentTarget;


        const formData =
            new FormData(form);


        // Honeypot protection

        const honeypot =
            formData.get("_gotcha");


        if (honeypot) {

            setContactStatus(
                "Thanks! Your message has been received."
            );

            form.reset();

            return;
        }


        setIsSubmitting(true);

        setContactStatus(
            "Sending your message..."
        );


        try {

            const response =
                await fetch(
                    FORMSPREE_ENDPOINT,
                    {
                        method: "POST",

                        body: formData,

                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );


            if (response.ok) {

                setContactStatus(
                    "✅ Message sent successfully! Thank you for contacting us."
                );

                form.reset();

            }
            else {

                let errorMessage =
                    "Failed to send message. Please try again.";

                try {

                    const data =
                        await response.json();

                    if (
                        data?.errors &&
                        data.errors.length > 0
                    ) {

                        errorMessage =
                            data.errors
                                .map(
                                    (error) =>
                                        error.message
                                )
                                .join(" ");

                    }

                }
                catch {
                    // Keep default error message
                }


                setContactStatus(
                    `❌ ${errorMessage}`
                );

            }

        }
        catch (error) {

            console.error(
                "Contact form error:",
                error
            );


            setContactStatus(
                "❌ Unable to send your message. Please check your internet connection and try again."
            );

        }
        finally {

            setIsSubmitting(false);

        }

    };


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


            {/* ================= ABOUT SECTION ================= */}

            <div className="page-container">

                <h1>
                    About FasalRakshak 🌱
                </h1>


                <p>
                    FasalRakshak is an agricultural assistance
                    platform designed to help farmers identify
                    crop diseases, understand crop health
                    conditions, and get useful farming information
                    easily.
                </p>


                <p>
                    Our goal is to use technology to make
                    agriculture smarter, faster, and more
                    accessible for farmers.
                </p>

            </div>


            {/* ================= PROJECT FEATURES ================= */}

            <div className="page-container">

                <h1>
                    Project Features
                </h1>


                <div className="cards">

                    <div className="card">

                        <h3>
                            📷 Image-Based Detection
                        </h3>

                        <p>
                            Upload or capture crop images
                            for disease analysis.
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            🎤 Voice Assistant
                        </h3>

                        <p>
                            Ask farming questions using
                            voice interaction.
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            🌍 Multilingual Support
                        </h3>

                        <p>
                            Supports multiple Indian languages
                            for better accessibility.
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            💬 Text Assistance
                        </h3>

                        <p>
                            Users can type questions and
                            get farming guidance.
                        </p>

                    </div>

                </div>

            </div>


            {/* ================= FUTURE DEVELOPMENT ================= */}

            <div className="page-container">

                <h1>
                    Future Improvements
                </h1>


                <div className="cards">

                    <div className="card">

                        <h3>
                            AI Disease Prediction
                        </h3>

                        <p>
                            Integration of machine learning
                            models for accurate prediction.
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            Weather Integration
                        </h3>

                        <p>
                            Provide weather-based farming
                            recommendations.
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            Expert Assistance
                        </h3>

                        <p>
                            Connect farmers with agricultural
                            experts.
                        </p>

                    </div>

                </div>

            </div>


            {/* ================= CONTACT ================= */}

            <div className="page-container">

                <h1>
                    Contact Us
                </h1>


                <form
                    id="contactForm"
                    onSubmit={handleContactSubmit}
                >

                    {/* NAME */}

                    <input
                        type="text"
                        id="contactName"
                        name="name"
                        placeholder="Your Name"
                        required
                    />


                    {/* EMAIL */}

                    <input
                        type="email"
                        id="contactEmail"
                        name="email"
                        placeholder="Your Email"
                        required
                    />


                    {/* MESSAGE */}

                    <textarea
                        id="contactMessage"
                        name="message"
                        placeholder="Your Message"
                        required
                    />


                    {/* HONEYPOT */}

                    <input
                        type="text"
                        id="contactHoneypot"
                        name="_gotcha"
                        tabIndex="-1"
                        autoComplete="off"
                        style={{
                            display: "none"
                        }}
                    />


                    {/* SUBMIT BUTTON */}

                    <button
                        type="submit"
                        id="contactSubmitBtn"
                        disabled={isSubmitting}
                    >

                        {isSubmitting
                            ? "Sending..."
                            : "Send Message"}

                    </button>


                    {/* STATUS */}

                    {contactStatus && (

                        <div
                            id="contactStatus"
                            style={{
                                marginTop: "15px"
                            }}
                        >

                            {contactStatus}

                        </div>

                    )}

                </form>

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
                    © 2026 FasalRakshak. All rights reserved.
                </p>

            </footer>

        </>
    );

}


export default About;
