// ============================================================
// FasalRakshak - Hybrid Detection
// Online  -> Gemini AI
// Offline -> Local Teachable Machine Model
// ============================================================

import { analyzeWithGemini } from "./gemini";
import { analyzeWithLocalModel } from "./cropModel";


// ============================================================
// CHECK WHETHER GEMINI SERVER IS AVAILABLE
// ============================================================

export async function isGeminiAvailable() {

    if (!navigator.onLine) {
        return false;
    }

    try {

        const response = await fetch(
            `${import.meta.env.VITE_GEMINI_SERVER_URL}/api/health`,
            {
                method: "GET",
                cache: "no-store"
            }
        );

        return response.ok;

    } catch (error) {

        console.warn(
            "Gemini server unavailable:",
            error
        );

        return false;
    }
}


// ============================================================
// MAIN HYBRID ANALYSIS
// ============================================================

export async function analyzeCropHybrid(
    imageElement,
    imageData,
    question = ""
) {

    console.log(
        "🌱 FasalRakshak hybrid analysis started"
    );


    // --------------------------------------------------------
    // TRY GEMINI FIRST
    // --------------------------------------------------------

    const geminiAvailable =
        await isGeminiAvailable();


    if (geminiAvailable) {

        console.log(
            "🌐 Online mode → Gemini"
        );

        try {

            const result =
                await analyzeWithGemini(
                    imageData,
                    question
                );

            return result;

        } catch (error) {

            console.warn(
                "⚠️ Gemini failed. Falling back to offline model.",
                error
            );

        }
    }


    // --------------------------------------------------------
    // OFFLINE FALLBACK
    // --------------------------------------------------------

    console.log(
        "📴 Offline mode → Local model"
    );


    return await analyzeWithLocalModel(
        imageElement
    );
}


// ============================================================
// DISPLAY MODE LABEL
// ============================================================

export function getDetectionModeLabel(
    mode
) {

    if (mode === "online") {
        return "🌐 Online";
    }

    return "📴 Offline";
}