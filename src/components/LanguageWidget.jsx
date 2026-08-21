import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// ============================================================
// FasalRakshak - Multilingual Widget
// React adaptation of the original working gtranslate.js
// ============================================================

const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "bn", name: "বাংলা (Bengali)" },
    { code: "te", name: "తెలుగు (Telugu)" },
    { code: "mr", name: "मराठी (Marathi)" },
    { code: "ta", name: "தமிழ் (Tamil)" },
    { code: "gu", name: "ગુજરાતી (Gujarati)" },
    { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
    { code: "ml", name: "മലയാളം (Malayalam)" },
    { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
    { code: "or", name: "ଓଡ଼ିଆ (Odia)" },
    { code: "as", name: "অসমীয়া (Assamese)" },
    { code: "ur", name: "اردو (Urdu)" },
    { code: "sa", name: "संस्कृतम् (Sanskrit)" },
    { code: "mai", name: "मैथिली (Maithili)" },
    { code: "gom", name: "कोंकणी (Konkani)" },
    { code: "doi", name: "डोगरी (Dogri)" },
    { code: "mni-Mtei", name: "মৈতৈলোন্ (Manipuri)" },
    { code: "sd", name: "سنڌي (Sindhi)" },
    { code: "ne", name: "नेपाली (Nepali)" }
];

const STORAGE_KEY = "cropHealthLangCode";
const CONCURRENCY = 5;

function LanguageWidget() {

    // ========================================================
    // ROUTE DETECTION
    // ========================================================

    const location = useLocation();


    // ========================================================
    // STATE
    // ========================================================

    const [currentLang, setCurrentLang] = useState(
        () => localStorage.getItem(STORAGE_KEY) || "en"
    );

    const [isOpen, setIsOpen] = useState(false);

    const [isTranslating, setIsTranslating] = useState(false);


    // ========================================================
    // ORIGINAL TEXT STORAGE
    // ========================================================

    const originalTextMap = useRef(new Map());

    const originalAttrMap = useRef(new Map());

    const translatingRef = useRef(false);


    // ========================================================
    // GET TRANSLATABLE TEXT NODES
    // ========================================================

    const getTextNodes = (root) => {

        const walker =
            document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode(node) {

                        const parent =
                            node.parentElement;

                        if (!parent) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        const tag =
                            parent.tagName;

                        if (
                            tag === "SCRIPT" ||
                            tag === "STYLE" ||
                            tag === "NOSCRIPT"
                        ) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        // Never translate language widget
                        if (
                            parent.closest(
                                ".ch-language-widget"
                            )
                        ) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        if (
                            !node.nodeValue ||
                            !node.nodeValue.trim()
                        ) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );


        const nodes = [];

        let node;

        while (
            (node = walker.nextNode())
        ) {
            nodes.push(node);
        }

        return nodes;
    };


    // ========================================================
    // TRANSLATABLE ATTRIBUTES
    // ========================================================

    const getTranslatableAttributes = (root) => {

        const elements =
            root.querySelectorAll(
                "[placeholder], [title]"
            );

        const items = [];

        elements.forEach((element) => {

            if (
                element.closest(
                    ".ch-language-widget"
                )
            ) {
                return;
            }

            if (
                element.hasAttribute(
                    "placeholder"
                )
            ) {
                items.push({
                    element,
                    attribute: "placeholder"
                });
            }

            if (
                element.hasAttribute(
                    "title"
                )
            ) {
                items.push({
                    element,
                    attribute: "title"
                });
            }

        });

        return items;
    };


    // ========================================================
    // CACHE
    // ========================================================

    const getCache = (language) => {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "chTransCache_" + language
                ) || "{}"
            );

        } catch {

            return {};

        }
    };


    const saveCache = (language, cache) => {

        try {

            localStorage.setItem(
                "chTransCache_" + language,
                JSON.stringify(cache)
            );

        } catch {

            // Ignore localStorage errors

        }
    };


    // ========================================================
    // GOOGLE TRANSLATION
    // ========================================================

    const translateText = async (
        text,
        targetLanguage,
        cache
    ) => {

        const trimmed =
            text.trim();

        if (!trimmed) {
            return text;
        }

        if (cache[trimmed]) {
            return cache[trimmed];
        }

        const url =
            "https://translate.googleapis.com/translate_a/single" +
            "?client=gtx" +
            "&sl=en" +
            "&tl=" +
            encodeURIComponent(targetLanguage) +
            "&dt=t" +
            "&q=" +
            encodeURIComponent(trimmed);

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Translate request failed: " +
                response.status
            );

        }

        const data =
            await response.json();

        const translated =
            data[0]
                .map(
                    (chunk) => chunk[0]
                )
                .join("");

        cache[trimmed] =
            translated;

        return translated;
    };


    // ========================================================
    // CONCURRENCY
    // ========================================================

    const runWithConcurrency = async (
        items,
        worker,
        limit
    ) => {

        let index = 0;

        async function next() {

            while (
                index <
                items.length
            ) {

                const currentIndex =
                    index++;

                await worker(
                    items[currentIndex]
                );
            }
        }

        const workers =
            Array.from(
                {
                    length:
                        Math.min(
                            limit,
                            items.length
                        )
                },
                () => next()
            );

        await Promise.all(
            workers
        );
    };


    // ========================================================
    // TRANSLATE WHOLE PAGE
    // ========================================================

    const translateToLanguage = async (
        language
    ) => {

        const cache =
            getCache(language);

        let cacheDirty = false;


        // ====================================================
        // TEXT NODES
        // ====================================================

        const nodes =
            getTextNodes(
                document.body
            );

        await runWithConcurrency(
            nodes,

            async (node) => {

                // Save ORIGINAL English text
                if (
                    !originalTextMap.current.has(
                        node
                    )
                ) {

                    originalTextMap.current.set(
                        node,
                        node.nodeValue
                    );
                }

                const original =
                    originalTextMap.current.get(
                        node
                    );

                if (
                    !original ||
                    !original.trim()
                ) {
                    return;
                }

                try {

                    const before =
                        cache[
                            original.trim()
                        ];

                    const translated =
                        await translateText(
                            original,
                            language,
                            cache
                        );

                    if (!before) {
                        cacheDirty = true;
                    }

                    node.nodeValue =
                        translated;

                } catch (error) {

                    console.warn(
                        "FasalRakshak translate: text node failed",
                        error
                    );

                }
            },

            CONCURRENCY
        );


        // ====================================================
        // PLACEHOLDERS / TITLES
        // ====================================================

        const attributes =
            getTranslatableAttributes(
                document.body
            );

        await runWithConcurrency(
            attributes,

            async ({
                element,
                attribute
            }) => {

                const mapKey =
                    attribute === "placeholder"
                        ? "ph"
                        : "ti";

                if (
                    !originalAttrMap.current.has(
                        element
                    )
                ) {

                    originalAttrMap.current.set(
                        element,
                        {}
                    );
                }

                const record =
                    originalAttrMap.current.get(
                        element
                    );

                if (
                    !(mapKey in record)
                ) {

                    record[mapKey] =
                        element.getAttribute(
                            attribute
                        );
                }

                const original =
                    record[mapKey];

                if (
                    !original ||
                    !original.trim()
                ) {
                    return;
                }

                try {

                    const before =
                        cache[
                            original.trim()
                        ];

                    const translated =
                        await translateText(
                            original,
                            language,
                            cache
                        );

                    if (!before) {
                        cacheDirty = true;
                    }

                    element.setAttribute(
                        attribute,
                        translated
                    );

                } catch (error) {

                    console.warn(
                        "FasalRakshak translate: attribute failed",
                        error
                    );

                }
            },

            CONCURRENCY
        );


        if (cacheDirty) {

            saveCache(
                language,
                cache
            );
        }
    };


    // ========================================================
    // RESTORE ENGLISH
    // ========================================================

    const restoreEnglish = () => {

        originalTextMap.current.forEach(
            (original, node) => {

                if (
                    node.isConnected
                ) {

                    node.nodeValue =
                        original;
                }
            }
        );


        originalAttrMap.current.forEach(
            (record, element) => {

                if (
                    !element.isConnected
                ) {
                    return;
                }

                if (
                    "ph" in record
                ) {

                    element.setAttribute(
                        "placeholder",
                        record.ph
                    );
                }

                if (
                    "ti" in record
                ) {

                    element.setAttribute(
                        "title",
                        record.ti
                    );
                }
            }
        );
    };


    // ========================================================
    // APPLY LANGUAGE
    // ========================================================

    const applyLanguage = async (
        language,
        silent = false
    ) => {

        if (
            translatingRef.current
        ) {
            return;
        }

        translatingRef.current =
            true;

        if (!silent) {

            setIsTranslating(
                true
            );
        }

        try {

            if (
                language === "en"
            ) {

                restoreEnglish();

            } else {

                await translateToLanguage(
                    language
                );
            }

            setCurrentLang(
                language
            );

            localStorage.setItem(
                STORAGE_KEY,
                language
            );

        } catch (error) {

            console.warn(
                "FasalRakshak translation failed:",
                error
            );

        } finally {

            translatingRef.current =
                false;

            if (!silent) {

                setIsTranslating(
                    false
                );
            }
        }
    };


    // ========================================================
    // SELECT LANGUAGE
    // ========================================================

    const selectLanguage = (
        language
    ) => {

        setIsOpen(false);

        applyLanguage(
            language
        );
    };


    // ========================================================
    // DYNAMIC CONTENT SUPPORT
    // ========================================================

    useEffect(() => {

        window.retranslateDynamicContent =
            () => {

                const language =
                    localStorage.getItem(
                        STORAGE_KEY
                    ) || "en";

                if (
                    language !== "en"
                ) {

                    applyLanguage(
                        language,
                        true
                    );
                }
            };


        return () => {

            delete window.retranslateDynamicContent;

        };

    }, []);


    // ========================================================
    // INITIAL LANGUAGE
    // ========================================================

    useEffect(() => {

        const savedLanguage =
            localStorage.getItem(
                STORAGE_KEY
            ) || "en";

        setCurrentLang(
            savedLanguage
        );

        // Wait until React has rendered the page
        const timer =
            setTimeout(() => {

                if (
                    savedLanguage !== "en"
                ) {

                    applyLanguage(
                        savedLanguage,
                        true
                    );

                }

            }, 100);

        return () => {
            clearTimeout(timer);
        };

    }, []);


    // ========================================================
    // ⭐ IMPORTANT: RE-TRANSLATE AFTER ROUTE CHANGE
    // ========================================================

    useEffect(() => {

        const savedLanguage =
            localStorage.getItem(
                STORAGE_KEY
            ) || "en";


        // English doesn't need translation
        if (
            savedLanguage === "en"
        ) {
            return;
        }


        // React needs a moment to render
        // the newly selected page.
        const timer =
            setTimeout(() => {

                console.log(
                    "🌐 Applying saved language:",
                    savedLanguage,
                    "to route:",
                    location.pathname
                );

                applyLanguage(
                    savedLanguage,
                    true
                );

            }, 150);


        return () => {
            clearTimeout(timer);
        };

    }, [location.pathname]);


    // ========================================================
    // CLOSE PANEL WHEN CLICKING OUTSIDE
    // ========================================================

    useEffect(() => {

        const handleOutsideClick = (
            event
        ) => {

            if (
                !event.target.closest(
                    ".ch-language-widget"
                )
            ) {

                setIsOpen(false);
            }
        };


        document.addEventListener(
            "click",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "click",
                handleOutsideClick
            );

        };

    }, []);


    // ========================================================
    // UI
    // ========================================================

    return (

        <div
            className="ch-language-widget"
            style={{
                position: "fixed",
                bottom: "22px",
                right: "22px",
                zIndex: 99999
            }}
        >

            {/* ==================================================
                LANGUAGE PANEL
            ================================================== */}

            {isOpen && (

                <div
                    style={{
                        position: "absolute",
                        bottom: "62px",
                        right: "0",
                        width: "240px",
                        maxHeight: "340px",
                        overflowY: "auto",
                        background: "white",
                        borderRadius: "14px",
                        boxShadow:
                            "0 8px 30px rgba(0,0,0,0.25)",
                        padding: "8px"
                    }}
                >

                    {LANGUAGES.map(
                        (language) => (

                            <button
                                key={
                                    language.code
                                }

                                onClick={() =>
                                    selectLanguage(
                                        language.code
                                    )
                                }

                                disabled={
                                    isTranslating
                                }

                                style={{
                                    width: "100%",
                                    padding:
                                        "10px 12px",
                                    border: "none",
                                    borderRadius:
                                        "8px",
                                    cursor:
                                        isTranslating
                                            ? "wait"
                                            : "pointer",
                                    textAlign: "left",
                                    fontSize: "14px",

                                    background:
                                        currentLang ===
                                        language.code
                                            ? "#2e7d32"
                                            : "transparent",

                                    color:
                                        currentLang ===
                                        language.code
                                            ? "white"
                                            : "#333",

                                    fontWeight:
                                        currentLang ===
                                        language.code
                                            ? "600"
                                            : "400"
                                }}
                            >

                                {
                                    language.name
                                }

                            </button>

                        )
                    )}

                </div>

            )}


            {/* ==================================================
                FLOATING BUTTON
            ================================================== */}

            <button
                onClick={() =>
                    setIsOpen(
                        previous =>
                            !previous
                    )
                }

                title="Change language / भाषा बदलें"

                style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: "#2e7d32",
                    color: "white",
                    fontSize: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow:
                        "0 4px 14px rgba(0,0,0,0.25)",
                    border: "none",

                    animation:
                        isTranslating
                            ? "chLanguageSpin 1s linear infinite"
                            : "none"
                }}
            >

                {isTranslating
                    ? "⟳"
                    : "🌐"}

            </button>


            {/* ==================================================
                ANIMATION
            ================================================== */}

            <style>
                {`
                    @keyframes chLanguageSpin {

                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }

                    }

                    .ch-language-widget button:hover {
                        transform: scale(1.05);
                    }
                `}
            </style>

        </div>
    );
}


export default LanguageWidget;