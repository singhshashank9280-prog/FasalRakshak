const voiceLanguages = {
    english: "en-IN",
    bengali: "bn-IN",
    telugu: "te-IN",
    marathi: "mr-IN",
    odia: "or-IN",
    assamese: "as-IN"
};


// ========================================================
// GET LANGUAGE CODE
// ========================================================

const getLanguageCode = (language) => {

    return (
        voiceLanguages[language] ||
        voiceLanguages.english
    );

};


// ========================================================
// SPEECH RECOGNITION
// ========================================================

export const startSpeechRecognition = (
    language,
    onResult,
    onStart,
    onError,
    onEnd
) => {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        throw new Error(
            "Speech recognition is not supported in this browser."
        );

    }


    const recognition =
        new SpeechRecognition();


    recognition.lang =
        getLanguageCode(language);


    recognition.continuous = false;

    recognition.interimResults = false;


    recognition.onstart = onStart;


    recognition.onresult = (event) => {

        const text =
            event.results[0][0].transcript;

        onResult(text);

    };


    recognition.onerror = onError;

    recognition.onend = onEnd;


    recognition.start();


    return recognition;
};


// ========================================================
// TEXT TO SPEECH
// ========================================================

export const speakText = (
    text,
    language
) => {

    if (!window.speechSynthesis) {

        throw new Error(
            "Text-to-speech is not supported in this browser."
        );

    }


    window.speechSynthesis.cancel();


    const utterance =
        new SpeechSynthesisUtterance(text);


    utterance.lang =
        getLanguageCode(language);


    utterance.rate = 0.9;


    window.speechSynthesis.speak(
        utterance
    );


    return utterance;
};