// ============================================================
// FasalRakshak - Detection History Service
// ============================================================

const HISTORY_KEY = "cropHistory";
const MAX_HISTORY = 50;


// ============================================================
// SAVE DETECTION
// ============================================================

export function saveToHistory(
    diseaseName,
    confidence,
    imageSrc
) {

    const history =
        JSON.parse(
            localStorage.getItem(HISTORY_KEY) || "[]"
        );


    history.unshift({

        diseaseName,

        confidence,

        imageSrc,

        timestamp:
            new Date().toLocaleString()

    });


    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(
            history.slice(0, MAX_HISTORY)
        )
    );

}


// ============================================================
// GET HISTORY
// ============================================================

export function getHistory() {

    return JSON.parse(
        localStorage.getItem(HISTORY_KEY) || "[]"
    );

}


// ============================================================
// CLEAR HISTORY
// ============================================================

export function clearHistory() {

    localStorage.removeItem(
        HISTORY_KEY
    );

}