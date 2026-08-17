// ============================================================
// FasalRakshak - Gemini AI Service
// ============================================================

const GEMINI_SERVER_URL =
    import.meta.env.VITE_GEMINI_SERVER_URL;


// ============================================================
// ANALYZE IMAGE WITH GEMINI
// ============================================================

export async function analyzeWithGemini(
    imageData,
    question = ""
) {

    const response = await fetch(
        `${GEMINI_SERVER_URL}/api/analyze`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                image: imageData,
                question: question
            })
        }
    );


    // --------------------------------------------------------
    // SERVER ERROR
    // --------------------------------------------------------

    if (!response.ok) {

        throw new Error(
            `Gemini server returned ${response.status}`
        );

    }


    // --------------------------------------------------------
    // PARSE RESPONSE
    // --------------------------------------------------------

    const result =
        await response.json();


    // --------------------------------------------------------
    // GEMINI/API ERROR
    // --------------------------------------------------------

    if (!result.success) {

        throw new Error(
            result.error ||
            "Gemini analysis failed"
        );

    }


    // --------------------------------------------------------
    // RETURN STANDARD RESULT
    // --------------------------------------------------------

    return {

        success: true,

        mode: "online",

        analysis: result.analysis,

        model:
            result.model ||
            "Gemini"

    };
}